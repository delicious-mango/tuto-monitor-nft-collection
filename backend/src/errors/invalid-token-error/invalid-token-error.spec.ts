import { InvalidTokenError } from './invalid-token-error';

describe('InvalidTokenError', () => {
  it('should be defined', () => {
    expect(new InvalidTokenError()).toBeDefined();
  });
});
