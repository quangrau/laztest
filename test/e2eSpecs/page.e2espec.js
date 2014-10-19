describe('home page title', function() {
    var ptor = protractor.getInstance();
    it('should be lazada', function() {
        ptor.get('/#');
        expect(ptor.getTitle()).toBe('lazada');
    });
});
