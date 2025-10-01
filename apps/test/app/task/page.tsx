"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiMarkdown,
  SiReact,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from "@repo/elements/task";
import { Button } from "@repo/shadcn-ui/components/ui/button";
import { tasksSchema } from "@/app/api/schemas";
import { useEffect, useMemo, useState } from "react";

const iconMap = {
  react: { component: SiReact, color: "#149ECA" },
  typescript: { component: SiTypescript, color: "#3178C6" },
  javascript: { component: SiJavascript, color: "#F7DF1E" },
  css: { component: SiCss, color: "#1572B6" },
  html: { component: SiHtml5, color: "#E34F26" },
  json: { component: SiJson, color: "#000000" },
  markdown: { component: SiMarkdown, color: "#000000" },
} as const;

const TaskPage = () => {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/agent-mock",
    schema: tasksSchema,
  });

  // Track which tasks should be open. Auto-open newly added tasks once when they first appear.
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({ 0: true });
  const taskCount = object?.tasks?.length ?? 0;
  const prevCount = useMemo(() => ({ val: taskCount }), []);
  useEffect(() => {
    // When task count increases, open the newly added task
    if (taskCount > prevCount.val) {
      setOpenMap((m) => ({ ...m, [taskCount - 1]: true }));
      prevCount.val = taskCount;
    } else if (taskCount < prevCount.val) {
      prevCount.val = taskCount;
    }
  }, [taskCount]);

  const handleSubmit = (taskType: string) => {
    submit({ prompt: taskType });
  };

  const renderTaskItem = (item: any, index: number) => {
    if (item?.type === "file" && item.file) {
      const iconInfo = iconMap[item.file.icon as keyof typeof iconMap];
      if (iconInfo) {
        const IconComponent = iconInfo.component;
        return (
          <span className="inline-flex items-center gap-1" key={index}>
            {item.text}
            <TaskItemFile>
              <IconComponent
                color={item.file.color || iconInfo.color}
                className="size-4"
              />
              <span>{item.file.name}</span>
            </TaskItemFile>
          </span>
        );
      }
    }
    return item?.text || "";
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 font-semibold text-2xl">Task Demo</h1>
      <p className="mb-6 text-muted-foreground">
        Streaming tasks using AI SDK. Click to generate a workflow and watch
        items stream into the Task list.
      </p>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Button
          onClick={() => handleSubmit("React component development")}
          disabled={isLoading}
          variant="outline"
        >
          React Development
        </Button>
        <Button
          onClick={() => handleSubmit("Landing page redesign")}
          disabled={isLoading}
          variant="outline"
        >
          Landing Page
        </Button>
        <Button
          onClick={() => handleSubmit("Node.js API refactor")}
          disabled={isLoading}
          variant="outline"
        >
          API Refactor
        </Button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">Error: {String(error)}</div>
      )}

      <div className="space-y-4">
        {object?.tasks?.map((task: any, taskIndex: number) => (
          <Task
            key={taskIndex}
            open={openMap[taskIndex] ?? (taskIndex === 0)}
            onOpenChange={(o) =>
              setOpenMap((m) => ({ ...m, [taskIndex]: o }))
            }
            className="w-full"
          >
            <TaskTrigger title={task.title || "Loading..."} />
            <TaskContent>
              {task.items?.map((item: any, itemIndex: number) => (
                <TaskItem key={itemIndex}>{renderTaskItem(item, itemIndex)}</TaskItem>
              ))}
            </TaskContent>
          </Task>
        ))}

        {!isLoading && !object && (
          <div className="text-muted-foreground">No tasks yet. Choose a preset above.</div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
