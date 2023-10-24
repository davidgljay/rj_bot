const { addAnswerToNotion } = require('../functions/addAnswerToNotion'); // Adjust the path to your file accordingly
jest.mock('@notionhq/client');

const { Client } = require('@notionhq/client');

// Mock implementations for lookup functions
jest.mock('../functions/addAnswerToNotion', () => {
  const originalModule = jest.requireActual('../functions/addAnswerToNotion');
  return {
    ...originalModule,
    lookupContactIdByPhoneNumber: jest.fn(() => 'mockedContactId'),
    lookupSurveyIdBySurveyId: jest.fn(() => 'mockedSurveyId'),
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