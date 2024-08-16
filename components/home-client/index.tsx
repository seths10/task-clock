"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast as sonner } from "sonner";
import {
  AlarmClockPlus,
  Binary,
  EyeOff,
  Info,
  MoveUpRight,
  Palette,
} from "lucide-react";
import { AddTaskFormSchema } from "@/schema/schema";
import { Task } from "@/types";
import { get12HourTimeFrom24HourTime } from "@/lib/utils";
import { Clock as ClockIcon } from "lucide-react";
import { TextEffect } from "@/components/ui/text-effect";
import Clock from "@/components/model/Clock";
import Navbar from "@/components/navbar/navbar";

export default function HomeClient() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [showColorInput, setShowColorInput] = React.useState(false);

  const form = useForm<z.infer<typeof AddTaskFormSchema>>({
    resolver: zodResolver(AddTaskFormSchema),
    defaultValues: {
      task: "",
      startTime: "",
      endTime: "",
      color: undefined,
    },
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          const validatedTasks = parsedTasks.map((task: any) => ({
            ...task,
            startTime: new Date(task.startTime),
            endTime: new Date(task.endTime),
          }));

          setTasks(validatedTasks);
        } catch (error) {
          sonner.error("Failed to parse tasks from local storage");
        }
      }
    }
  }, []);

  const sortedTasks = [...tasks].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  );

  const onDeleteTask = (taskToDelete: Task) => {
    const updatedTasks = tasks.filter((task) => task !== taskToDelete);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    sonner(`Deleted task: '${taskToDelete.text}'`, { duration: 5000 });
  };

  function onSubmit(data: z.infer<typeof AddTaskFormSchema>) {
    const parseTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      return new Date(new Date().setHours(hours, minutes, 0, 0));
    };

    const generateRandomColor = () => {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };

    const newTask: Task = {
      text: data.task,
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
      color: data.color || generateRandomColor(),
    };

    setTasks([...tasks, newTask]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));

    sonner.message("Task Added", {
      description: `'${data.task}' scheduled from ${get12HourTimeFrom24HourTime(
        data.startTime
      )} to ${get12HourTimeFrom24HourTime(data.endTime)}`,
      duration: 5000,
    });

    form.reset();
  }

  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#e6e5e5] dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_0.5px,#09090b_1px)] dark:bg-[size:30px_30px]">
      <Navbar />
      <div className="flex justify-center items-center pt-[5rem] w-full h-full">
        <Clock tasks={tasks} size={600} onDeleteTask={onDeleteTask} />
      </div>

      <div className="absolute bottom-5 right-10 overflow-hidden">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isFormVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {isFormVisible && (
            <div className="px-4 py-4 dark:border-none border border-slate-200 w-[24rem] rounded-2xl backdrop-blur-md dark:bg-black/10 bg-white/10 shadow-lg">
              <div className="dark:text-white/80 text-dark hover:dark:text-white text-dark cursor-pointer transition-colors duration-200">
                <p
                  onClick={() => setIsFormVisible(!isFormVisible)}
                  className="underline text-right text-xs"
                >
                  Hide
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white/80 text-dark">
                          Task
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="w-full bg-white/10 dark:border-white/20 border-black/30 dark:text-white text-dark placeholder-white/50 focus:border-white/50 transition-colors duration-200"
                            required
                            placeholder="Enter a new task"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="dark:text-white/80 text-dark">
                            Start Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="time"
                              className="bg-white/10 dark:border-white/20 border-black/30 dark:text-white text-dark focus:border-white/50 transition-colors duration-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="dark:text-white/80 text-dark">
                            End Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="time"
                              className="bg-white/10 dark:border-white/20 border-black/30 dark:text-white text-dark focus:border-white/50 transition-colors duration-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowColorInput(!showColorInput)}
                    className="flex items-center gap-2 float-right dark:text-white/80 text-dark hover:dark:text-white text-dark transition-colors duration-200"
                  >
                    {showColorInput ? (
                      <EyeOff size={20} className="dark:text-white text-dark" />
                    ) : (
                      <Palette
                        size={20}
                        className="dark:text-white text-dark"
                      />
                    )}
                    {showColorInput ? "Hide Color Input" : "Assign Color"}
                  </Button>

                  {showColorInput && (
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="dark:text-white/80 text-dark">
                            Color (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              className="h-10 cursor-pointer bg-transparent dark:border-white/20 border-black/30 rounded-md overflow-hidden"
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full dark:bg-white/20 bg-gray-200 border border-black/10 hover:bg-gray-300 hover:dark:bg-white/80 dark:text-white text-dark transition-colors duration-200"
                  >
                    Add Task
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>

        {!isFormVisible && (
          <MovingBorderButton
            borderRadius="2rem"
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex z-[100] bg-white/10 hover:bg-white/20 dark:bg-transparent dark:text-white text-dark transition-colors duration-200"
          >
            <AlarmClockPlus size={20} />
          </MovingBorderButton>
        )}
      </div>

      <div className="absolute left-5 top-1/2 transform -translate-y-1/2 w-60">
        {tasks.length > 0 && (
          <h2 className="dark:text-[#ffffff80] text-dark mb-2 text-sm tracking-wide font-light">
            Timeline
          </h2>
        )}
        <div className="space-y-3 relative max-h-[300px] overflow-y-auto">
          {sortedTasks.map((task, index) => {
            const isTaskCompleted = new Date() > task.endTime;

            return (
              <div key={index} className="relative">
                <div className="flex items-start relative z-10">
                  <div className="flex flex-col items-center mr-2">
                    <div
                      className={`p-1 rounded-full  flex items-center justify-center}`}
                    >
                      <ClockIcon
                        size={14}
                        className="dark:text-[#fff] text-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="dark:text-white text-dark text-sm font-medium">
                        {task.startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="dark:text-white/40 text-dark text-sm">
                      {task.text}
                    </p>
                  </div>
                </div>

                <div
                  className={`absolute left-[9px] top-1 bottom-0 w-[0.05rem] ${
                    isTaskCompleted
                      ? "bg-teal-00"
                      : "border-dashed border-[#ff5722]"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 absolute bottom-5 left-5 overflow-hidden">
        <Info size={20} className="dark:text-white text-dark" />
        <div className="flex flex-col gap-1">
          <TextEffect
            per="word"
            className="text-xs dark:text-white/80 text-dark flex items-center"
            as="h3"
            preset="slide"
          >
            Press and hold on a task to delete it.
          </TextEffect>
          <div className="flex gap-1 items-center text-xs">
            <TextEffect
              per="word"
              className="text-xs dark:text-white/80 text-dark flex items-center"
              as="h3"
              preset="slide"
            >
              Built with
            </TextEffect>
            <Binary className="inline-block h-5 w-5 text-[#31bdc6]" />
            <p className="flex gap-1 items-center text-xs dark:text-white/80 text-dark">
              <a
                className="underline"
                href="https://github.com/seths10"
                target="_blank"
                rel="noreferrer"
              >
                Seth Addo
              </a>
              <span>
                {
                  <MoveUpRight
                    size={14}
                    className="dark:text-white text-dark underline"
                  />
                }
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
