import { generateV4Id } from '@src/shared/utils/generate_id';

describe('generateV4Id', () => {
  it('should return a valid UUID v4', () => {
    const id = generateV4Id();

    const uuidV4Pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    expect(id).toMatch(uuidV4Pattern);
  });

  it('should generate unique UUIDs', () => {
    const id1 = generateV4Id();
    const id2 = generateV4Id();

    expect(id1).not.toBe(id2);
  });
});
