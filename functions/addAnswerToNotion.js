const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: 'YOUR_NOTION_API_KEY', // Replace this with your Notion API key
});

async function addAnswerToNotion(answer) {
  const { phoneNumber, timestamp, text, surveyId } = answer;

  // Assuming you have functions to look up contacts and surveys by their respective IDs
  const contactId = await lookupContactIdByPhoneNumber(phoneNumber);
  const surveyLinkId = await lookupSurveyIdBySurveyId(surveyId);

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
              id: surveyLinkId,
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
  // Implementation for looking up contact by phone number
}

async function lookupSurveyIdBySurveyId(surveyId) {
  // Implementation for looking up survey by surveyId
}

module.exports = { addAnswerToNotion, lookupContactIdByPhoneNumber, lookupSurveyIdBySurveyId };