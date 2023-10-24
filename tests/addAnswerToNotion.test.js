
const { addAnswerToNotion, lookupContactIdByPhoneNumber } = require('../functions/addAnswerToNotion'); // Adjust the path to your file accordingly
jest.mock('@notionhq/client');

const { Client } = require('@notionhq/client');

// Mock implementations for lookup functions
jest.mock('../functions/addAnswerToNotion', () => {
  const originalModule = jest.requireActual('../functions/addAnswerToNotion');
  return {
    ...originalModule
  };
});


describe('addAnswerToNotion', () => {
  it('should add an answer to Notion database', async () => {
    const answer = {
      phoneNumber: '1234567890',
      timestamp: '2023-10-23T10:00:00.000Z',
      text: 'Sample answer text',
      surveyId: 'sampleSurveyId',
    };

    const mockNotionPagesCreate = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        // Mocked response
      });
    });

    Client.prototype.pages = {
      create: mockNotionPagesCreate,
    };

    const response = await addAnswerToNotion(answer);
    expect(response).toBeTruthy();
    expect(mockNotionPagesCreate).toHaveBeenCalledWith({
      parent: expect.any(Object),
      properties: expect.any(Object),
    });
  });

  it('should handle errors gracefully', async () => {
    const answer = {
      phoneNumber: '1234567890',
      timestamp: '2023-10-23T10:00:00.000Z',
      text: 'Sample answer text',
      surveyId: 'sampleSurveyId',
    };

    const mockNotionPagesCreate = jest.fn().mockImplementation(() => {
      throw new Error('Mocked Notion API Error');
    });

    Client.prototype.pages = {
      create: mockNotionPagesCreate,
    };

    const response = await addAnswerToNotion(answer);
    expect(response).toBeNull();
    expect(mockNotionPagesCreate).toHaveBeenCalledWith({
      parent: expect.any(Object),
      properties: expect.any(Object),
    });
  });
});

describe('lookupContactIdByPhoneNumber', () => {
  it('should return the ID of the contact record', async () => {
    const phoneNumber = '1234567890';
    const databaseId = 'YOUR_CONTACTS_DATABASE_ID'; // Replace this with your contacts database id

    const mockNotionDatabasesQuery = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        results: [{ id: 'mockedContactId' }],
      });
    });

    Client.prototype.databases = {
      query: mockNotionDatabasesQuery,
    };

    const contactId = await lookupContactIdByPhoneNumber(phoneNumber);
    expect(contactId).toBe('mockedContactId');
    expect(mockNotionDatabasesQuery).toHaveBeenCalledWith({
      database_id: databaseId,
      filter: {
        property: 'phoneNumber',
        text: {
          equals: phoneNumber,
        },
      },
    });
  });

  it('should handle errors gracefully', async () => {
    const phoneNumber = '1234567890';
    const databaseId = 'YOUR_CONTACTS_DATABASE_ID'; // Replace this with your contacts database id

    const mockNotionDatabasesQuery = jest.fn().mockImplementation(() => {
      throw new Error('Mocked Notion API Error');
    });

    Client.prototype.databases = {
      query: mockNotionDatabasesQuery,
    };

    const contactId = await lookupContactIdByPhoneNumber(phoneNumber);
    expect(contactId).toBeNull();
    expect(mockNotionDatabasesQuery).toHaveBeenCalledWith({
      database_id: databaseId,
      filter: {
        property: 'phoneNumber',
        text: {
          equals: phoneNumber,
        },
      },
    });
  });
});