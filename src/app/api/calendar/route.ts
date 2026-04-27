/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

function getGoogleAuth() {
    const jsonEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (jsonEnv) {
        return new google.auth.GoogleAuth({
            credentials: JSON.parse(jsonEnv),
            scopes: ['https://www.googleapis.com/auth/calendar.events'],
        });
    }

    const keyFile = path.join(process.cwd(), 'google-credentials.json');

    if (!fs.existsSync(keyFile)) {
        throw new Error('Missing Google Calendar credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON or provide google-credentials.json locally.');
    }

    return new google.auth.GoogleAuth({
        keyFile,
        scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');

        const auth = getGoogleAuth();

        const calendar = google.calendar({ version: 'v3', auth });
        const calendarId = process.env.GOOGLE_CALENDAR_ID || 'ahmedyassermoustaid@gmail.com';

        const targetDate = dateParam ? new Date(dateParam) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const tonight = new Date(targetDate);
        
        if (searchParams.get('range') === 'month') {
            targetDate.setDate(1); // start of month
            tonight.setMonth(tonight.getMonth() + 1);
            tonight.setDate(0); // end of month
            tonight.setHours(23, 59, 59, 999);
        } else if (searchParams.get('range') === 'all') {
            targetDate.setFullYear(2023, 0, 1); 
            tonight.setFullYear(2027, 11, 31);
        } else {
            tonight.setHours(23, 59, 59, 999);
        }

        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: targetDate.toISOString(),
            timeMax: tonight.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const parsedEvents = (response.data.items || []).map((item: any) => {
            const start = item.start?.dateTime || item.start?.date;
            const end = item.end?.dateTime || item.end?.date;

            let startHour = "00";
            if (start && start.includes("T")) {
                startHour = start.split("T")[1].substring(0, 5); // '09:00'
            } else if (item.start?.date) {
                startHour = "All Day";
            }

            let duration = 1;
            if (start && end && start.includes("T") && end.includes("T")) {
                const sH = parseInt(startHour.split(":")[0], 10);
                const eH = parseInt(end.split("T")[1].substring(0, 2), 10);
                if (!isNaN(sH) && !isNaN(eH)) duration = Math.max(1, eH - sH);
            }

            let name = item.summary || "Occupied";
            let type = "Consultation";
            if (name.includes(" - ")) {
                const parts = name.split(" - ");
                type = parts[0];
                name = parts.slice(1).join(" - ");
            }

            return {
                id: item.id,
                time: startHour,
                date: item.start?.dateTime ? item.start.dateTime.substring(0, 10) : item.start?.date,
                name: name,
                type: type,
                duration: duration,
                created: item.created,
                description: item.description || ""
            };
        });

        return NextResponse.json({ events: parsedEvents });

    } catch (error: any) {
        console.error("Calendar REST API Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const auth = getGoogleAuth();

        const calendar = google.calendar({ version: 'v3', auth });
        const calendarId = process.env.GOOGLE_CALENDAR_ID || 'ahmedyassermoustaid@gmail.com';

        let event;

        if (body.startDateTime && body.endDateTime) {
            event = {
                summary: body.summary || `${body.type || 'Consultation'} - ${body.name || 'Patient'}`,
                description: body.description || `Generated automatically from AdminHub`,
                start: { dateTime: new Date(body.startDateTime).toISOString() },
                end: { dateTime: new Date(body.endDateTime).toISOString() },
            };
        } else if (body.time === "All Day") {
            const startDate = body.startDate ? new Date(body.startDate) : (body.date ? new Date(body.date) : new Date());
            const endDate = body.endDate ? new Date(body.endDate) : new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);

            event = {
                summary: `${body.type} - ${body.name}`,
                description: `Generated automatically from AdminHub`,
                start: { date: startDate.toISOString().split('T')[0] },
                end: { date: endDate.toISOString().split('T')[0] },
            };
        } else {
            const targetDate = body.date ? new Date(body.date) : new Date();
            const [hour, min] = body.time.split(':');
            targetDate.setHours(parseInt(hour, 10), parseInt(min || "0", 10), 0, 0);

            const startTime = new Date(targetDate);
            const endTime = new Date(targetDate);
            endTime.setHours(startTime.getHours() + (body.duration || 1));

            event = {
                summary: `${body.type} - ${body.name}`,
                description: `Generated automatically from AdminHub`,
                start: { dateTime: startTime.toISOString() },
                end: { dateTime: endTime.toISOString() },
            };
        }

        const result = await calendar.events.insert({
            calendarId: calendarId,
            requestBody: event,
        });

        return NextResponse.json({ success: true, event: result.data }, { status: 201 });
    } catch (error: any) {
        console.error("Calendar POST error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get('id');

        if (!eventId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const auth = getGoogleAuth();

        const calendar = google.calendar({ version: 'v3', auth });
        const calendarId = process.env.GOOGLE_CALENDAR_ID || 'ahmedyassermoustaid@gmail.com';

        await calendar.events.delete({
            calendarId: calendarId,
            eventId: eventId,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Calendar DELETE error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


