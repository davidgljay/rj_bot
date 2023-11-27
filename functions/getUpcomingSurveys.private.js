const { Client } = require('@notionhq/client');

// Initialize a new notion client
const notion = new Client({
  auth: 'YOUR_NOTION_API_KEY', // Replace this with your Notion API key
});

// Function to get all entries for the next hour
async function getEntriesForNextHour() {
  const currentTime = new Date();
  const nextHour = new Date(currentTime.getTime() + 60 * 60 * 1000);

  try {
    const response = await notion.databases.query({
      database_id: 'boy_surveys', // Replace this with your database id
      filter: {
        property: 'datetime',
        date: {
          on_or_after: currentTime.toISOString().slice(0, 19) + 'Z',
          on_or_before: nextHour.toISOString().slice(0, 19) + 'Z',
        },
      },
    });

    return response.results;
  } catch (error) {
    console.error('Error', error);
    return [];
  }
}

//TODO: Iterate through results and run Twilio scripts accordingly. Presumably each script will have a url, those urls could be saved in the DB. 

// Call the function and handle the returned entries
// getEntriesForNextHour().then((entries) => {
//   console.log('Entries for the next hour:', entries);
// });

module.exports = { getEntriesForNextHour };