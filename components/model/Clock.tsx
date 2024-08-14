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

  const pressTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseDown = (task: Task) => {
    pressTimeoutRef.current = setTimeout(() => {
      onDeleteTask(task);
    }, 3000);
  };

  const handleMouseUp = () => {
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
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
            onMouseDown={() => handleMouseDown(task)}
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
            {(() => {
              const rectWidth = 180;
              const rectHeight = 60;

              return (
                <>
                  <rect
                    x={size / 2 - rectWidth / 2}
                    y={size / 2 - rectHeight / 2}
                    width={rectWidth}
                    height={rectHeight}
                    fill="#222"
                    stroke="#888"
                    rx="8"
                    ry="8"
                  />
                  <text
                    x={size / 2}
                    y={size / 2 - rectHeight / 2 + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="14"
                  >
                    {hoveredTask.text}
                  </text>
                  <text
                    x={size / 2}
                    y={size / 2 - rectHeight / 2 + 50}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ccc"
                    fontSize="12"
                  >
                    {`${formatTime(hoveredTask.startTime)} - ${formatTime(
                      hoveredTask.endTime
                    )}`}
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
