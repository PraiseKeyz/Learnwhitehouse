import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
        unique: true
      },
      title: {
        type: String,
        required: true
      },
      description: String,
      coordinator: {
        type: String,
        required: true
      },
      level: {
        type: Number,
        required: true
      },
      semester: {
        type: String,
        enum: ["First", "Second"],
        required: true
      },
      units: {
        type: String,
        required: true
      }
}, {timestamps: true})

const Course = mongoose.model('Course', courseSchema)

export default Course;