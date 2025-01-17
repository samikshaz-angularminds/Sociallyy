import { FilteredUsersPipe } from './filtered-users.pipe';

describe('FilteredUsersPipe', () => {
  it('create an instance', () => {
    const pipe = new FilteredUsersPipe();
    expect(pipe).toBeTruthy();
  });
});
