import { Request, Response } from 'express';
import Course from '../model/course';

// Create new course
export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// Get all courses
export const getAllCourses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get courses by level and semester
export const getCoursesByLevelAndSemester = async (req: Request, res: Response): Promise<void> => {
    try {
        const { level, semester } = req.query;

        const courses = await Course.find({ level, semester });

        if (courses.length === 0) {
            res.status(404).json({ message: 'No courses found for the specified level and semester.' });
            return;
        }

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Update course
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

// Delete course
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};