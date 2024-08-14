"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { AlarmClockPlus, EyeOff, Info, MoveUpRight, Palette } from "lucide-react";
import { AddTaskFormSchema } from "@/schema/schema";
import { Task } from "@/types";
import { get12HourTimeFrom24HourTime } from "@/lib/utils";
import Clock from "@/components/model/Clock";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
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
  }, []);

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
    <div className="w-screen h-screen bg-[#151515] relative overflow-hidden">
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
            <div className="p-6 w-[24rem] rounded-2xl backdrop-blur-md bg-white/10 shadow-lg">
              <div className="text-white/80 hover:text-white cursor-pointer transition-colors duration-200">
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
                        <FormLabel className="text-white/80">Task</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/50 transition-colors duration-200"
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
                          <FormLabel className="text-white/80">
                            Start Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="time"
                              className="bg-white/10 border-white/20 text-white focus:border-white/50 transition-colors duration-200"
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
                          <FormLabel className="text-white/80">
                            End Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="time"
                              className="bg-white/10 border-white/20 text-white focus:border-white/50 transition-colors duration-200"
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
                    className="flex items-center gap-2 float-right text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {showColorInput ? (
                      <EyeOff size={20} className="text-white" />
                    ) : (
                      <Palette size={20} className="text-white" />
                    )}
                    {showColorInput
                      ? "Hide Color Input"
                      : "Assign Color"}
                  </Button>

                  {showColorInput && (
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-white/80">
                            Color (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              className="h-10 cursor-pointer bg-transparent border-white/20 rounded-md overflow-hidden"
                            />
                          </FormControl>
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
                  >
                    Add Task
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>

        {!isFormVisible && (
          <Button
            className="flex z-[100] py-6 shadow-lg rounded-3xl float-right justify-center items-center bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            <AlarmClockPlus size={20} />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 absolute bottom-5 left-5 overflow-hidden">
        <Info size={20} className="text-white" />
        <div className="flex flex-col gap-1">
          <p className="text-xs text-white/80 flex items-center">
            Press and hold on a task to delete it.
          </p>
          <p className="flex gap-1 items-center text-xs text-white/80">
            Made with ❤️ by{" "}
            <a
              className="underline"
              href="https://github.com/seths10"
              target="_blank"
              rel="noreferrer"
            >
              Seth Addo
            </a>
            <span>
              {<MoveUpRight size={14} className="text-white underline" />}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
