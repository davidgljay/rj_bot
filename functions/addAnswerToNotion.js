const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: 'YOUR_NOTION_API_KEY', // Replace this with your Notion API key
});

async function addAnswerToNotion(answer) {
  const { phoneNumber, timestamp, text, surveyId } = answer;

  // Assuming you have functions to look up contact by their phone number
  const contactId = await lookupContactIdByPhoneNumber(phoneNumber);

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: 'answers', // Replace this with your answers database id
      },
      properties: {
        Phone: {
          title: [
            { 
              text: {
                content: phoneNumber,
              },
            },
          ],
        },
        Timestamp: {
          date: {
            start: timestamp,
          },
        },
        Text: {
          rich_text: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
        Survey: {
          relation: [
            {
              id: surveyId,
            },
          ],
        },
        Contact: {
          relation: [
            {
              id: contactId,
            },
          ],
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
}

async function lookupContactIdByPhoneNumber(phoneNumber) {
  const databaseId = 'YOUR_CONTACTS_DATABASE_ID'; // Replace this with your contacts database id

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'phoneNumber',
        text: {
          equals: phoneNumber,
        },
      },
    });

    if (response.results.length > 0) {
      return response.results[0].id;
    } else {
      // Handle case when no contact is found
      return null;
    }
  } catch (error) {
    console.error('Error', error);
    return null;
  }
}


module.exports = { addAnswerToNotion, lookupContactIdByPhoneNumber };