import React, { useEffect, useState } from "react";

interface Task {
  text: string;
  startTime: Date;
  endTime: Date;
  color: string;
}

interface ClockProps {
  tasks: Task[];
  size: number;
}

const Clock: React.FC<ClockProps> = ({ tasks, size }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hoverDirection, setHoverDirection] = useState<
    "left" | "right" | "top" | "bottom"
  >("right");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getAngle = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return ((hours + minutes / 60) / 24) * 360;
  };

  const getHoverDirection = (angle: number) => {
    if (angle > 45 && angle <= 135) return "top";
    if (angle > 225 && angle <= 315) return "bottom";
    return angle > 90 && angle < 270 ? "left" : "right";
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
        const midAngle = (startAngle + endAngle) / 2;
        const radius = size / 2 - 20;
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

        const start = getCoordinatesForAngle(startAngle, radius);
        const end = getCoordinatesForAngle(endAngle, radius);
        const middle = getCoordinatesForAngle(midAngle, radius);

        const outerStart = getCoordinatesForAngle(startAngle, radius + 10);
        const outerEnd = getCoordinatesForAngle(endAngle, radius + 10);

        const d = [
          `M ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
          `L ${outerEnd.x} ${outerEnd.y}`,
          `A ${radius + 10} ${radius + 10} 0 ${largeArcFlag} 0 ${
            outerStart.x
          } ${outerStart.y}`,
          `Z`,
        ].join(" ");

        return (
          <path
            key={index}
            d={d}
            fill={task.color}
            onMouseEnter={() => {
              setHoveredTask(task);
              setHoverPosition(middle);
              setHoverDirection(
                midAngle > 90 && midAngle < 270 ? "left" : "right"
              );
            }}
            onMouseLeave={() => {
              setHoveredTask(null);
              setHoverPosition(null);
            }}
          />
        );
      })}

      <line
        x1={size / 2}
        y1={size / 2}
        x2={getCoordinatesForAngle(currentAngle, size / 2 - 30).x}
        y2={getCoordinatesForAngle(currentAngle, size / 2 - 30).y}
        stroke="white"
        strokeWidth="0.5"
      />

      <circle cx={size / 2} cy={size / 2} r="0.25" fill="white" />

      {hoveredTask && hoverPosition && (
        <>
          <line
            x1={hoverPosition.x}
            y1={hoverPosition.y}
            x2={
              hoverDirection === "right"
                ? size + 10
                : hoverDirection === "left"
                ? -10
                : hoverPosition.x
            }
            y2={
              hoverDirection === "top"
                ? -10
                : hoverDirection === "bottom"
                ? size + 10
                : hoverPosition.y
            }
            stroke="white"
            strokeWidth="0.5"
          />
          <rect
            x={
              hoverDirection === "right"
                ? size + 20
                : hoverDirection === "left"
                ? hoverPosition.x - 140
                : hoverPosition.x - 60
            }
            y={
              hoverDirection === "top"
                ? hoverPosition.y - 60
                : hoverDirection === "bottom"
                ? hoverPosition.y + 20
                : hoverPosition.y - 20
            }
            width="120"
            height="40"
            fill="#222"
            stroke="#888"
            rx="12"
            ry="12"
          />
          <text
            x={
              hoverDirection === "right"
                ? size + 80
                : hoverDirection === "left"
                ? hoverPosition.x - 80
                : hoverPosition.x
            }
            y={
              hoverDirection === "top"
                ? hoverPosition.y - 20
                : hoverDirection === "bottom"
                ? hoverPosition.y + 20
                : hoverPosition.y
            }
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="12"
          >
            {hoveredTask.text}
          </text>
        </>
      )}
    </svg>
  );
};

export default Clock;
