import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, ClockProps } from "@/types";

const Clock: React.FC<ClockProps> = ({ tasks, size, onDeleteTask }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [hoveredTask, setHoveredTask] = React.useState<Task | null>(null);
  const [hoverPosition, setHoverPosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteProgress, setDeleteProgress] = React.useState(0);

  const pressTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseDown = (
    task: Task,
    e: React.MouseEvent<SVGPathElement, MouseEvent>
  ) => {
    setHoverPosition({ x: e.clientX, y: e.clientY });
    setIsDeleting(true);
    setDeleteProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setDeleteProgress((prev) => Math.min(prev + 1, 100));
    }, 30);

    pressTimeoutRef.current = setTimeout(() => {
      clearInterval(progressIntervalRef.current!);
      setDeleteProgress(100);
      onDeleteTask(task);
      setIsDeleting(false);
    }, 3000);
  };

  const handleMouseUp = () => {
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
      setIsDeleting(false);
      setDeleteProgress(0);
      clearInterval(progressIntervalRef.current!);
    }
  };

  const getAngle = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return ((hours + minutes / 60) / 24) * 360;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCoordinatesForAngle = (angle: number, radius: number) => {
    const x = size / 2 + radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y = size / 2 + radius * Math.sin((angle - 90) * (Math.PI / 180));
    return { x, y };
  };

  const currentAngle = getAngle(currentTime);

  return (
    <svg
      className="pt-6"
      width={size + 500}
      height={size}
      viewBox={`0 0 ${size} ${size + 25}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        stroke="#646464"
        strokeWidth={2}
        strokeLinejoin="round"
        r={size / 2 - 30}
        fill="#1a1a1a"
      />

      {[...Array(24)].map((_, i) => {
        const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
        const ampm = i < 12 ? "AM" : "PM";
        const isMainHour = i === 12 || i === 0;
        let { x, y } = getCoordinatesForAngle(i * 15, size / 2 + 5);

        if (i === 0) {
          y += 15;
        }

        const lineEnd = getCoordinatesForAngle(i * 15, size / 2 - 30);
        return (
          <g key={i}>
            <line
              x1={size / 2}
              y1={size / 2}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke="#888888"
              strokeWidth="0.05"
              strokeDasharray="5"
            />

            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isMainHour ? "#ffffff" : "#888888"}
              fontSize={isMainHour ? 14 : 10}
            >
              {`${hour}${ampm}`}
            </text>
          </g>
        );
      })}

      {tasks.map((task, index) => {
        const startAngle = getAngle(task.startTime);
        const endAngle = getAngle(task.endTime);
        const radius = size / 2 - 20;
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

        const start = getCoordinatesForAngle(startAngle, radius);
        const end = getCoordinatesForAngle(endAngle, radius);

        const isHovered = hoveredTask === task;

        const d = [
          `M ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
        ].join(" ");

        return (
          <motion.path
            key={index}
            d={d}
            fill="none"
            cursor={isHovered ? "pointer" : "default"}
            stroke={task.color}
            initial={{ strokeWidth: 10 }}
            animate={{ strokeWidth: isHovered ? 12 : 10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => {
              setHoveredTask(task);
              setHoverPosition({ x: size / 2, y: size / 2 });
            }}
            onMouseLeave={() => {
              setHoveredTask(null);
              setHoverPosition(null);
            }}
            onMouseDown={(e) => handleMouseDown(task, e)}
            onMouseUp={handleMouseUp}
          />
        );
      })}

      <line
        x1={size / 2}
        y1={size / 2}
        x2={getCoordinatesForAngle(currentAngle, size / 2 - 30).x}
        y2={getCoordinatesForAngle(currentAngle, size / 2 - 30).y}
        stroke="teal"
        strokeWidth="0.5"
      />

      <circle cx={size / 2} cy={size / 2} r="0.25" fill="white" />

      <AnimatePresence>
        {hoveredTask && hoverPosition && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {isDeleting && (
              <g>
                {(() => {
                  const startAngle = getAngle(hoveredTask.startTime);
                  const start = getCoordinatesForAngle(
                    startAngle,
                    size / 2 - 20
                  );

                  return (
                    <>
                      <circle
                        cx={start.x - 75}
                        cy={start.y }
                        r="25"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={Math.PI * 50}
                        strokeDashoffset={
                          ((100 - deleteProgress) / 100) * Math.PI * 50
                        }
                      />
                      <text
                        x={start.x - 75}
                        y={start.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10"
                      >
                        Deleting
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
            {(() => {
              const rectWidth = 200;
              const rectHeight = 100;
              const barWidth = 4;
              const barHeight = 20;

              return (
                <>
                  <rect
                    x={size / 2 - rectWidth / 2}
                    y={size / 2 - rectHeight / 2}
                    width={rectWidth}
                    height={rectHeight}
                    fill="#222"
                    stroke="#444"
                    strokeWidth="1"
                    rx="10"
                    ry="10"
                  />

                  <text
                    x={size / 2}
                    y={size / 2 - rectHeight / 2 + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="16"
                  >
                    {hoveredTask.text}
                  </text>

                  <rect
                    x={size / 2 - rectWidth / 2 + 10}
                    y={size / 2 + 5}
                    width={barWidth}
                    height={barHeight}
                    fill={hoveredTask.color}
                    rx={barWidth / 2}
                    ry={barWidth / 2}
                  />

                  <text
                    x={size / 2 - rectWidth / 2 + 20}
                    y={size / 2 + 25}
                    textAnchor="start"
                    dominantBaseline="middle"
                    fill="#ccc"
                    fontSize="14"
                  >
                    {formatTime(hoveredTask.startTime)}
                  </text>

                  <text
                    x={size / 2 - rectWidth / 2 + 20}
                    y={size / 2 + 5}
                    textAnchor="start"
                    dominantBaseline="middle"
                    fill="#ccc"
                    fontSize="10"
                  >
                    Start Time
                  </text>

                  <rect
                    x={size / 2 + rectWidth / 2 - 10 - barWidth}
                    y={size / 2 + 5}
                    width={barWidth}
                    height={barHeight}
                    fill={hoveredTask.color}
                    rx={barWidth / 2}
                    ry={barWidth / 2}
                  />

                  <text
                    x={size / 2 + rectWidth / 2 - 20}
                    y={size / 2 + 25}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fill="#ccc"
                    fontSize="14"
                  >
                    {formatTime(hoveredTask.endTime)}
                  </text>

                  <text
                    x={size / 2 + rectWidth / 2 - 20}
                    y={size / 2 + 5}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fill="#ccc"
                    fontSize="10"
                  >
                    End Time
                  </text>
                </>
              );
            })()}
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
};

export default Clock;
