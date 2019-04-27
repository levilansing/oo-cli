// silence expected console.error()
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
