// functions/setActiveSurveyForContact.js

const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: 'YOUR_NOTION_API_KEY', // Replace this with your Notion API key
});

// Implementation for setting the active survey status for a contact
async function setActiveSurveyForContact(contactId, active) {
  const propertyName = 'active_survey';
  const databaseId = 'YOUR_CONTACTS_DATABASE_ID'; // Replace this with your contacts database id

  try {
    const response = await notion.pages.update({
      page_id: contactId,
      properties: {
        [propertyName]: {
          checkbox: active,
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
}

module.exports = { setActiveSurveyForContact };