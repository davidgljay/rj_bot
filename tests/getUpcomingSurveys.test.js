const { getEntriesForNextHour } = require('../functions/getUpcomingSurveys.js'); 
jest.mock('@notionhq/client');

const { Client } = require('@notionhq/client');

describe('getEntriesForNextHour', () => {
  it('should return entries for the next hour', async () => {
    const mockedResponse = {
      results: [
        // mocked results here
      ],
    };

    const mockDatabaseQuery = jest.fn().mockImplementation(() => {
      return Promise.resolve(mockedResponse);
    });

    Client.prototype.databases = {
      query: mockDatabaseQuery,
    };

    const entries = await getEntriesForNextHour();
    expect(entries).toEqual(mockedResponse.results);
    expect(mockDatabaseQuery).toHaveBeenCalledWith({
      database_id: 'boy_surveys', // Replace this with your database id
      filter: expect.any(Object),
    });
  });

  it('should handle errors gracefully', async () => {
    const mockDatabaseQuery = jest.fn().mockImplementation(() => {
      throw new Error('Mocked Notion API Error');
    });

    Client.prototype.databases = {
      query: mockDatabaseQuery,
    };

    const entries = await getEntriesForNextHour();
    expect(entries).toEqual([]);
    expect(mockDatabaseQuery).toHaveBeenCalledWith({
      database_id: 'boy_surveys', // Replace this with your database id
      filter: expect.any(Object),
    });
  });
});
