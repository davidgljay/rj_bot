// tests/setActiveSurveyForContact.test.js

const { setActiveSurveyForContact } = require('../functions/setActiveSurveyForContact'); // Adjust the path to your file accordingly
jest.mock('@notionhq/client');

const { Client } = require('@notionhq/client');

describe('setActiveSurveyForContact', () => {
  it('should set the active_survey field to true for the contact', async () => {
    const contactId = 'mockedContactId';
    const active = true;

    const mockNotionPagesUpdate = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        // Mocked response
      });
    });

    Client.prototype.pages = {
      update: mockNotionPagesUpdate,
    };

    const response = await setActiveSurveyForContact(contactId, active);
    expect(response).toBeTruthy();
    expect(mockNotionPagesUpdate).toHaveBeenCalledWith({
      page_id: contactId,
      properties: {
        active_survey: {
          checkbox: active,
        },
      },
    });
  });

  it('should handle errors gracefully', async () => {
    const contactId = 'mockedContactId';
    const active = true;

    const mockNotionPagesUpdate = jest.fn().mockImplementation(() => {
      throw new Error('Mocked Notion API Error');
    });

    Client.prototype.pages = {
      update: mockNotionPagesUpdate,
    };

    const response = await setActiveSurveyForContact(contactId, active);
    expect(response).toBeNull();
    expect(mockNotionPagesUpdate).toHaveBeenCalledWith({
      page_id: contactId,
      properties: {
        active_survey: {
          checkbox: active,
        },
      },
    });
  });
});