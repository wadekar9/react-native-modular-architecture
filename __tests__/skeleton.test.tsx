import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Skeleton, SkeletonText, SkeletonCard } from '../src/shared/components/ui/skeleton';
import { RecipeCardSkeleton } from '../src/modules/verticals/food/components/cards/recipe-card-skeleton.component';
import { EventCardSkeleton } from '../src/modules/verticals/dining/components/event-card-skeleton.component';
import RecipeDetailsSkeleton from '../src/modules/verticals/food/screens/recipe-details/recipe-details-skeleton.component';
jest.mock('../src/shared/hooks/app-theme.hook', () => ({
  useAppTheme: () => ({
    theme: 'light',
    colors: {
      'surface-alt': '#E2E8F0',
      surface: '#FFFFFF',
      border: '#E2E8F0',
      background: '#F8FAFC',
    },
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
  }),
}));

describe('Skeleton UI System', () => {
  it('renders base Skeleton with custom dimensions without crashing', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <Skeleton width={120} height={24} borderRadius={8} animation="none" accessibilityLabel="Custom loader" />
      );
    });
    const json = renderer.toJSON() as ReactTestRenderer.ReactTestRendererJSON;
    expect(json).toBeTruthy();
    expect(json.props.accessibilityLabel).toBe('Custom loader');
    expect(json.props.accessibilityState).toEqual({ busy: true });
    expect(json.props.style).toEqual(
      expect.objectContaining({
        width: 120,
        height: 24,
        borderRadius: 8,
      })
    );
  });

  it('renders circular Skeleton correctly', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <Skeleton height={50} circle animation="none" accessibilityLabel="Avatar loader" />
      );
    });
    const json = renderer.toJSON() as ReactTestRenderer.ReactTestRendererJSON;
    expect(json).toBeTruthy();
    expect(json.props.accessibilityLabel).toBe('Avatar loader');
    expect(json.props.style).toEqual(
      expect.objectContaining({
        width: 50,
        height: 50,
        borderRadius: 9999,
      })
    );
  });

  it('renders SkeletonText with expected number of lines', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <SkeletonText lines={4} lineHeight={14} animation="none" />
      );
    });
    const root = renderer.root;
    const lines = root.findAllByType(Skeleton);
    expect(lines).toHaveLength(4);
  });

  it('renders SkeletonCard with media and body lines', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <SkeletonCard showMedia lines={2} />
      );
    });
    const root = renderer.root;
    const parts = root.findAllByType(Skeleton);
    expect(parts.length).toBeGreaterThanOrEqual(5);
  });

  it('renders RecipeCardSkeleton matching recipe card layout', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<RecipeCardSkeleton />);
    });
    const root = renderer.root;
    const parts = root.findAllByType(Skeleton);
    expect(parts.length).toBeGreaterThanOrEqual(6);
  });

  it('renders EventCardSkeleton for dining events', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<EventCardSkeleton featured />);
    });
    const root = renderer.root;
    const parts = root.findAllByType(Skeleton);
    expect(parts.length).toBeGreaterThanOrEqual(5);
  });

  it('renders RecipeDetailsSkeleton for full screen loading', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<RecipeDetailsSkeleton />);
    });
    const root = renderer.root;
    const parts = root.findAllByType(Skeleton);
    expect(parts.length).toBeGreaterThanOrEqual(10);
  });
});
