describe('Simple test with done', () => {
  it('should pass with done callback', (done) => {
    expect(1 + 1).toBe(2);
    console.log('Test completed successfully');
    done();
  });
});
