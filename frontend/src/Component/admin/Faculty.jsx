// import React from 'react'
// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { 
//   Users, Clock, BookOpen, Star, 
//   Calendar, Award, ChevronRight 
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function Faculty() {
//   const performanceData = [
//     { month: 'Jan', rating: 4.5 },
//     { month: 'Feb', rating: 4.7 },
//     { month: 'Mar', rating: 4.6 },
//     { month: 'Apr', rating: 4.8 },
//   ];

//   const schedule = [
//     { time: '09:00 AM', class: 'Mathematics 101', room: 'Room 204' },
//     { time: '11:00 AM', class: 'Advanced Algebra', room: 'Room 305' },
//     { time: '02:00 PM', class: 'Geometry', room: 'Room 201' },
//   ];

//   const stats = [
//     { title: 'Total Students', value: '180', icon: Users, color: 'bg-blue-500' },
//     { title: 'Classes Today', value: '4', icon: Clock, color: 'bg-green-500' },
//     { title: 'Average Rating', value: '4.8', icon: Star, color: 'bg-yellow-500' },
//     { title: 'Courses', value: '6', icon: BookOpen, color: 'bg-purple-500' },
//   ];



//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Profile Header */}
//       <div className="bg-white shadow-md">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
//             <img
//               src="/api/placeholder/150/150"
//               alt="Teacher Profile"
//               className="w-24 h-24 rounded-full ring-4 ring-blue-100"
//             />
//             <div className="text-center md:text-left">
//               <h1 className="text-2xl font-bold">Dr. Sarah Johnson</h1>
//               <p className="text-gray-600">Mathematics Department</p>
//               <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
//                 <Award className="h-5 w-5 text-yellow-500" />
//                 <span className="text-sm text-gray-600">Senior Professor</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Column - Stats and Chart */}
//           <div className="lg:w-8/12 space-y-8">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {stats.map((stat, index) => (
//                 <Card 
//                   key={index}
//                   className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
//                 >
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <div className={`p-2 rounded-lg ${stat.color}`}>
//                         <stat.icon className="h-5 w-5 text-white" />
//                       </div>
//                       <span className="text-sm">{stat.title}</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-2xl font-bold">{stat.value}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Performance Chart */}
//             <Card className="transform transition-all duration-300 hover:shadow-lg">
//               <CardHeader>
//                 <CardTitle>Performance Rating</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px] w-full">
//                   <LineChart
//                     width={800}
//                     height={300}
//                     data={performanceData}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line 
//                       type="monotone" 
//                       dataKey="rating" 
//                       stroke="#8884d8" 
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Schedule */}
//           <div className="lg:w-4/12">
//             <Card className="sticky top-8 transform transition-all duration-300 hover:shadow-lg">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Calendar className="h-5 w-5" />
//                   <span>Today's Schedule</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {schedule.map((item, index) => (
//                     <div 
//                       key={index}
//                       className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
//                     >
//                       <div className="flex-1">
//                         <p className="font-medium">{item.class}</p>
//                         <div className="flex items-center space-x-2 text-sm text-gray-600">
//                           <Clock className="h-4 w-4" />
//                           <span>{item.time}</span>
//                           <span>•</span>
//                           <span>{item.room}</span>
//                         </div>
//                       </div>
//                       <ChevronRight className="h-5 w-5 text-gray-400" />
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// const TeacherDashboard = () => {
//   // Sample data - replace with real data later
//   const performanceData = [
//     { month: 'Jan', rating: 4.5 },
//     { month: 'Feb', rating: 4.7 },
//     { month: 'Mar', rating: 4.6 },
//     { month: 'Apr', rating: 4.8 },
//   ];

//   const schedule = [
//     { time: '09:00 AM', class: 'Mathematics 101', room: 'Room 204' },
//     { time: '11:00 AM', class: 'Advanced Algebra', room: 'Room 305' },
//     { time: '02:00 PM', class: 'Geometry', room: 'Room 201' },
//   ];

//   const stats = [
//     { title: 'Total Students', value: '180', icon: Users, color: 'bg-blue-500' },
//     { title: 'Classes Today', value: '4', icon: Clock, color: 'bg-green-500' },
//     { title: 'Average Rating', value: '4.8', icon: Star, color: 'bg-yellow-500' },
//     { title: 'Courses', value: '6', icon: BookOpen, color: 'bg-purple-500' },
//   ];


// };
import React from 'react'

export default function Faculty() {
  return (
    <div>
      
    </div>
  )
}

