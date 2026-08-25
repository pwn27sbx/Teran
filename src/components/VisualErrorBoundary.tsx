import React, { ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export class VisualErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in visual component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[200px]">
          <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 p-6 text-center">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm">{this.props.fallbackMessage || "Visual effect could not be loaded."}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
