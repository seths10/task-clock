"use client";

import { useEffect, useState } from "react";
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
import { AlarmClockPlus } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import dynamic from "next/dynamic";

const Clock = dynamic(() => import("@/components/model/Clock"), { ssr: false });

interface Task {
  text: string;
  startTime: Date;
  endTime: Date;
  color: string;
}

const FormSchema = z.object({
  task: z.string().min(2, {
    message: "Task must be at least 2 characters.",
  }),
  startTime: z.string(),
  endTime: z.string(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Invalid color format. Use #RRGGBB",
  }),
});

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      task: "",
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const parseTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      return new Date(new Date().setHours(hours, minutes, 0, 0));
    };

    const opacityHex = "E6";

    const newTask: Task = {
      text: data.task,
      startTime: parseTime(data.startTime),
      endTime: parseTime(data.endTime),
      color: `${data.color}${opacityHex}`,
    };

    setTasks([...tasks, newTask]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));

    sonner.info(
      `'${data.task}' scheduled from ${data.startTime} to ${data.endTime}`,
      {
        duration: 5000,
      }
    );

    form.reset();
  }

  return (
    <div className="w-screen h-screen bg-[#151515] relative overflow-hidden">
      <Navbar />
      <div className="flex justify-center items-center pt-[5rem] w-full h-full">
        <Clock tasks={tasks} size={600} />
      </div>

      <div className="absolute bottom-5 right-10 overflow-hidden">
        <div
          className={`transition-all duration-300 transform ${
            isFormVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
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
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-white/80">Color</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="color"
                          {...field}
                          className="h-10 cursor-pointer bg-transparent border-white/20 rounded-md overflow-hidden"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
                >
                  Add Task
                </Button>
                <p
                  className="text-center text-xs cursor-pointer text-white underline"
                  onClick={() => localStorage.clear()}
                >
                  Clear Tasks
                </p>
              </form>
            </Form>
          </div>
        </div>

        {!isFormVisible && (
          <Button
            className="flex float-right justify-center items-center bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            <AlarmClockPlus size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}
