import React from "react";

function TaskDetails({ tasks }) {
    return (
        <div className="bg-[#242424] rounded-xl p-5 text-white shadow-md m-4 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">All Tasks</h2>

            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="text-[#D68C42] border-b border-gray-700">
                        <th className="py-2 pr-4">ID</th>
                        <th className="py-2 pr-4">Title</th>
                        <th className="py-2 pr-4">Priority</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Created</th>
                        <th className="py-2 pr-4">Completed</th>
                        <th className="py-2">Photo</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="border-b border-gray-800">
                            <td className="py-2 pr-4">{task.id}</td>
                            <td className="py-2 pr-4">{task.title}</td>
                            <td className="py-2 pr-4 capitalize">{task.priority}</td>
                            <td className="py-2 pr-4 capitalize">{task.status}</td>
                            <td className="py-2 pr-4">{task.createdAt}</td>
                            <td className="py-2 pr-4">{task.completedAt || "-"}</td>
                            <td className="py-2">{task.hasImage ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskDetails;