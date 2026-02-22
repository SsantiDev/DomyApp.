import React from 'react';
import renderer from 'react-test-renderer';

const DummyComponent = () => null;

describe('Basic Test', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<DummyComponent />).toJSON();
        expect(tree).toBeNull();
    });

    it('verifies truth', () => {
        expect(true).toBe(true);
    });
});
