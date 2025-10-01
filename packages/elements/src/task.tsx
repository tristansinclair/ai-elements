"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/shadcn-ui/components/ui/collapsible";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, memo, useContext } from "react";

export type TaskItemFileProps = ComponentProps<"div">;

export const TaskItemFile = memo(({ children, className, ...props }: TaskItemFileProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-foreground text-xs",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

export type TaskItemProps = ComponentProps<"div">;

export const TaskItem = memo(({ children, className, ...props }: TaskItemProps) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>
    {children}
  </div>
));

type TaskContextValue = {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
};

const TaskContext = createContext<TaskContextValue | null>(null);
const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("Task components must be used within <Task>");
  return ctx;
};

export type TaskProps = ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Task = ({
  defaultOpen = true,
  className,
  ...props
}: TaskProps) => (
  <Collapsible className={cn(className)} defaultOpen={defaultOpen} {...props} />
);

export type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  title: string;
};

export const TaskTrigger = memo(({ children, className, title, ...props }: TaskTriggerProps) => {
  const { isOpen, setIsOpen } = useTask();
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className={cn("flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground", className)} {...props}>
        {children ?? (
          <>
            <SearchIcon className="size-4" />
            <p className="text-sm">{title}</p>
            <ChevronDownIcon className={cn("size-4 transition-transform", isOpen ? "rotate-180" : "rotate-0")} />
          </>
        )}
      </CollapsibleTrigger>
    </Collapsible>
  );
});

export type TaskContentProps = ComponentProps<typeof CollapsibleContent>;

export const TaskContent = memo(({ children, className, ...props }: TaskContentProps) => {
  const { isOpen } = useTask();
  return (
    <Collapsible open={isOpen}>
      <CollapsibleContent
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          className
        )}
        {...props}
      >
        <div className="mt-4 space-y-2 border-muted border-l-2 pl-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
});

Task.displayName = "Task";
TaskTrigger.displayName = "TaskTrigger";
TaskContent.displayName = "TaskContent";
TaskItem.displayName = "TaskItem";
TaskItemFile.displayName = "TaskItemFile";
