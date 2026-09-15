import { Component, type ReactNode } from "react";

export default class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene failed to render, falling back:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
