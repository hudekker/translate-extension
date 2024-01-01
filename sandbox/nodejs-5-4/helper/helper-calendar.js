async function listEvents(calendar) {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // const response = await calendar.events.list({
    //   calendarId: 'primary', // Use 'primary' for the primary calendar or specify another calendar ID
    //   timeMin: firstDayOfMonth.toISOString(),
    //   timeMax: lastDayOfMonth.toISOString(),
    //   maxResults: 10,
    //   singleEvents: true,
    //   orderBy: 'startTime',
    // });

    // Retrieve events with all fields
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: firstDayOfMonth.toISOString(),
      timeMax: lastDayOfMonth.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
      fields: '*' // Retrieve all available fields for each event
    });

    const events = response.data.items;
    if (events.length) {
      console.log('Upcoming events this month:');
      const formattedEvents = events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        return {
          'Start Time': start,
          'Summary': event.summary,
          'Description': event.description,
          // 'Link': event.htmlLink,
          'Creator Email': event.creator.email,
          // 'Location': event.location
        };
      });
      console.table(formattedEvents);
    } else {
      console.log('No upcoming events found.');
    }

  } catch (error) {
    console.error('Error fetching calendar events:', error);
  }
}

export { listEvents };
