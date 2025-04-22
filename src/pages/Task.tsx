import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';

// Types
type Course = {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  lastAccessed: Date;
  modules: Module[];
};

type Module = {
  id: string;
  title: string;
  duration: string;
  lectures: Lecture[];
  quiz?: Quiz;
};

type Lecture = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
  bookmarks: Bookmark[];
  notes: Note[];
};

type Bookmark = {
  id: string;
  time: number;
  note: string;
  createdAt: Date;
};

type Note = {
  id: string;
  content: string;
  timestamp?: number;
  createdAt: Date;
};

type Quiz = {
  id: string;
  questions: Question[];
  passingScore: number;
};

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
};

type UserData = {
  courses: Course[];
  currentCourse?: string;
  currentLecture?: {
    courseId: string;
    moduleId: string;
    lectureId: string;
  };
};

// Mock Data
const initialData: UserData = {
  courses: [
    {
      id: 'course-1',
      title: 'Advanced React with TypeScript',
      instructor: 'Jane Smith',
      thumbnail: 'https://source.unsplash.com/random/300x200/?coding,react',
      progress: 35,
      lastAccessed: new Date(),
      modules: [
        {
          id: 'module-1',
          title: 'Getting Started with TypeScript',
          duration: '2h 15m',
          lectures: [
            {
              id: 'lecture-1',
              title: 'Introduction to TypeScript',
              duration: '15:20',
              videoUrl: 'https://example.com/video1',
              completed: true,
              bookmarks: [],
              notes: [],
            },
            {
              id: 'lecture-2',
              title: 'TypeScript with React',
              duration: '22:45',
              videoUrl: 'https://example.com/video2',
              completed: true,
              bookmarks: [],
              notes: [],
            },
          ],
          quiz: {
            id: 'quiz-1',
            passingScore: 70,
            questions: [
              {
                id: 'q1',
                question: 'What is TypeScript?',
                options: [
                  'A JavaScript framework',
                  'A superset of JavaScript',
                  'A CSS preprocessor',
                  'A database language'
                ],
                correctAnswer: 1
              },
              {
                id: 'q2',
                question: 'How do you define types in TypeScript?',
                options: [
                  'Using the "type" keyword',
                  'Using interfaces',
                  'Using classes',
                  'All of the above'
                ],
                correctAnswer: 3
              }
            ]
          }
        },
        {
          id: 'module-2',
          title: 'Advanced React Patterns',
          duration: '3h 30m',
          lectures: [
            {
              id: 'lecture-3',
              title: 'Higher Order Components',
              duration: '18:30',
              videoUrl: 'https://example.com/video3',
              completed: false,
              bookmarks: [],
              notes: [],
            },
            {
              id: 'lecture-4',
              title: 'Render Props Pattern',
              duration: '25:15',
              videoUrl: 'https://example.com/video4',
              completed: false,
              bookmarks: [],
              notes: [],
            },
          ]
        }
      ]
    },
    {
      id: 'course-2',
      title: 'Modern UI Development with Tailwind CSS',
      instructor: 'John Doe',
      thumbnail: 'https://source.unsplash.com/random/300x200/?design,tailwind',
      progress: 80,
      lastAccessed: new Date(Date.now() - 86400000),
      modules: [
        {
          id: 'module-1',
          title: 'Tailwind Fundamentals',
          duration: '1h 45m',
          lectures: [
            {
              id: 'lecture-1',
              title: 'Utility-First Approach',
              duration: '12:20',
              videoUrl: 'https://example.com/video5',
              completed: true,
              bookmarks: [],
              notes: [],
            },
          ]
        }
      ]
    }
  ],
  currentCourse: 'course-1',
  currentLecture: {
    courseId: 'course-1',
    moduleId: 'module-1',
    lectureId: 'lecture-1'
  }
};

const ELearningPlatform: React.FC = () => {
  // State
  const [userData, setUserData] = useState<UserData>(initialData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newBookmarkText, setNewBookmarkText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const notesSectionRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('eLearningPlatformData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        const processedData = {
          ...parsedData,
          courses: parsedData.courses.map((course: any) => ({
            ...course,
            lastAccessed: new Date(course.lastAccessed),
            modules: course.modules.map((module: any) => ({
              ...module,
              lectures: module.lectures.map((lecture: any) => ({
                ...lecture,
                bookmarks: lecture.bookmarks.map((bookmark: any) => ({
                  ...bookmark,
                  createdAt: new Date(bookmark.createdAt)
                })),
                notes: lecture.notes.map((note: any) => ({
                  ...note,
                  createdAt: new Date(note.createdAt)
                }))
              }))
            }))
          }))
        };
        setUserData(processedData);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eLearningPlatformData', JSON.stringify(userData));
  }, [userData]);

  // Get current course and lecture
  const currentCourse = userData.courses.find(c => c.id === userData.currentCourse);
  const currentModule = currentCourse?.modules.find(m => m.id === userData.currentLecture?.moduleId);
  const currentLecture = currentModule?.lectures.find(l => l.id === userData.currentLecture?.lectureId);

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Progress tracking
  const markLectureCompleted = (lectureId: string, completed: boolean) => {
    setUserData(prev => {
      const updatedCourses = prev.courses.map(course => {
        if (course.id === prev.currentCourse) {
          const updatedModules = course.modules.map(module => {
            const updatedLectures = module.lectures.map(lecture => {
              if (lecture.id === lectureId) {
                return { ...lecture, completed };
              }
              return lecture;
            });
            return { ...module, lectures: updatedLectures };
          });
          
          // Calculate new course progress
          const totalLectures = updatedModules.reduce((sum, module) => sum + module.lectures.length, 0);
          const completedLectures = updatedModules.reduce((sum, module) => 
            sum + module.lectures.filter(l => l.completed).length, 0);
          const newProgress = Math.round((completedLectures / totalLectures) * 100);
          
          return { 
            ...course, 
            modules: updatedModules,
            progress: newProgress,
            lastAccessed: new Date()
          };
        }
        return course;
      });
      
      return { ...prev, courses: updatedCourses };
    });
  };

  // Bookmarks
  const addBookmark = () => {
    if (!currentLecture || !newBookmarkText.trim()) return;
    
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      time: currentTime,
      note: newBookmarkText.trim(),
      createdAt: new Date()
    };
    
    setUserData(prev => {
      const updatedCourses = prev.courses.map(course => {
        if (course.id === prev.currentCourse) {
          const updatedModules = course.modules.map(module => {
            if (module.id === prev.currentLecture?.moduleId) {
              const updatedLectures = module.lectures.map(lecture => {
                if (lecture.id === prev.currentLecture?.lectureId) {
                  return { 
                    ...lecture, 
                    bookmarks: [...lecture.bookmarks, newBookmark] 
                  };
                }
                return lecture;
              });
              return { ...module, lectures: updatedLectures };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      });
      
      return { ...prev, courses: updatedCourses };
    });
    
    setNewBookmarkText('');
  };

  const removeBookmark = (bookmarkId: string) => {
    setUserData(prev => {
      const updatedCourses = prev.courses.map(course => {
        if (course.id === prev.currentCourse) {
          const updatedModules = course.modules.map(module => {
            if (module.id === prev.currentLecture?.moduleId) {
              const updatedLectures = module.lectures.map(lecture => {
                if (lecture.id === prev.currentLecture?.lectureId) {
                  return { 
                    ...lecture, 
                    bookmarks: lecture.bookmarks.filter(b => b.id !== bookmarkId) 
                  };
                }
                return lecture;
              });
              return { ...module, lectures: updatedLectures };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      });
      
      return { ...prev, courses: updatedCourses };
    });
  };

  // Notes
  const addNote = () => {
    if (!currentLecture || !newNoteText.trim()) return;
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: newNoteText.trim(),
      timestamp: currentTime,
      createdAt: new Date()
    };
    
    setUserData(prev => {
      const updatedCourses = prev.courses.map(course => {
        if (course.id === prev.currentCourse) {
          const updatedModules = course.modules.map(module => {
            if (module.id === prev.currentLecture?.moduleId) {
              const updatedLectures = module.lectures.map(lecture => {
                if (lecture.id === prev.currentLecture?.lectureId) {
                  return { 
                    ...lecture, 
                    notes: [...lecture.notes, newNote] 
                  };
                }
                return lecture;
              });
              return { ...module, lectures: updatedLectures };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      });
      
      return { ...prev, courses: updatedCourses };
    });
    
    setNewNoteText('');
  };

  const updateNote = (noteId: string, newContent: string) => {
    setUserData(prev => {
      const updatedCourses = prev.courses.map(course => {
        if (course.id === prev.currentCourse) {
          const updatedModules = course.modules.map(module => {
            if (module.id === prev.currentLecture?.moduleId) {
              const updatedLectures = module.lectures.map(lecture => {
                if (lecture.id === prev.currentLecture?.lectureId) {
                  const updatedNotes = lecture.notes.map(note => {
                    if (note.id === noteId) {
                      return { ...note, content: newContent };
                    }
                    return note;
                  });
                  return { ...lecture, notes: updatedNotes };
                }
                return lecture;
              });
              return { ...module, lectures: updatedLectures };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      });
      
      return { ...prev, courses: updatedCourses };
    });
  };

  const removeNote = (noteId: string) => {
    setUserData(prev => {
      const updatedCourses = prev.courses.map(course => {
        if (course.id === prev.currentCourse) {
          const updatedModules = course.modules.map(module => {
            if (module.id === prev.currentLecture?.moduleId) {
              const updatedLectures = module.lectures.map(lecture => {
                if (lecture.id === prev.currentLecture?.lectureId) {
                  return { 
                    ...lecture, 
                    notes: lecture.notes.filter(n => n.id !== noteId) 
                  };
                }
                return lecture;
              });
              return { ...module, lectures: updatedLectures };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      });
      
      return { ...prev, courses: updatedCourses };
    });
  };

  // Quiz handling
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (!currentModule?.quiz) return;
    
    setUserData(prev => {
      const updatedCourses = prev.courses.map(course => {
        if (course.id === prev.currentCourse) {
          const updatedModules = course.modules.map(module => {
            if (module.id === prev.currentLecture?.moduleId && module.quiz) {
              const updatedQuestions = module.quiz.questions.map(question => {
                if (question.id === questionId) {
                  return { ...question, userAnswer: answerIndex };
                }
                return question;
              });
              return { ...module, quiz: { ...module.quiz, questions: updatedQuestions } };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      });
      
      return { ...prev, courses: updatedCourses };
    });
  };

  const submitQuiz = () => {
    if (!currentModule?.quiz) return;
    
    const correctAnswers = currentModule.quiz.questions.filter(
      q => q.userAnswer === q.correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / currentModule.quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Mark module as completed if passing score achieved
    if (score >= currentModule.quiz.passingScore) {
      if (currentModule.lectures) {
        currentModule.lectures.forEach(lecture => {
          if (!lecture.completed) {
            markLectureCompleted(lecture.id, true);
          }
        });
      }
    }
  };

  // Navigation
  const selectLecture = (courseId: string, moduleId: string, lectureId: string) => {
    setUserData(prev => ({
      ...prev,
      currentCourse: courseId,
      currentLecture: { courseId, moduleId, lectureId }
    }));
    setActiveTab('content');
    setQuizSubmitted(false);
    setQuizScore(null);
    setMobileSidebarOpen(false);
  };

  const selectCourse = (courseId: string) => {
    const course = userData.courses.find(c => c.id === courseId);
    if (course) {
      const firstModule = course.modules[0];
      if (firstModule) {
        const firstLecture = firstModule.lectures[0];
        if (firstLecture) {
          selectLecture(courseId, firstModule.id, firstLecture.id);
        }
      }
    }
  };

  // Responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll notes section when it's toggled
  useEffect(() => {
    if (showNotes && notesSectionRef.current) {
      notesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showNotes]);

  if (!currentCourse || !currentModule || !currentLecture) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <LucideIcons.AlertCircle className="w-12 h-12 mx-auto text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">No course selected</h1>
          <p className="mt-2 text-gray-600">Please select a course from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-20 bottom-4 right-4 lg:hidden p-3 bg-indigo-600 text-white rounded-full shadow-lg"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? (
          <LucideIcons.X className="w-6 h-6" />
        ) : (
          <LucideIcons.Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-10 w-80 h-full bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${mobileSidebarOpen ? 'translate-x-0 shadow-xl' : ''}
          lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button (mobile) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <LucideIcons.BookOpen className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">LearnHub</span>
            </div>
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <LucideIcons.X className="w-5 h-5" />
            </button>
          </div>

          {/* Courses list */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">My Courses</h2>
              <div className="space-y-2">
                {userData.courses.map(course => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${course.id === currentCourse.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}`}
                    onClick={() => selectCourse(course.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{course.title}</h3>
                        <p className="text-xs text-gray-500">{course.instructor}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="relative w-8 h-8">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="2"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              stroke="#4F46E5"
                              strokeWidth="2"
                              strokeDasharray={`${course.progress} 100`}
                              strokeDashoffset="25"
                              strokeLinecap="round"
                              transform="rotate(-90 18 18)"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course content outline */}
            <div className="p-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentCourse.title}</h2>
              <div className="space-y-4">
                {currentCourse.modules.map(module => (
                  <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`flex items-center justify-between p-3 ${module.id === currentModule.id ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      <span className="text-xs text-gray-500">{module.duration}</span>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {module.lectures.map(lecture => (
                        <div
                          key={lecture.id}
                          className={`p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 ${lecture.id === currentLecture.id ? 'bg-indigo-100' : ''}`}
                          onClick={() => selectLecture(currentCourse.id, module.id, lecture.id)}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${lecture.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {lecture.completed ? (
                              <LucideIcons.Check className="w-3 h-3" />
                            ) : (
                              <LucideIcons.Play className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${lecture.id === currentLecture.id ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>
                              {lecture.title}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">{lecture.duration}</span>
                        </div>
                      ))}
                      {module.quiz && (
                        <div
                          className={`p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 ${activeTab === 'quiz' && module.id === currentModule.id ? 'bg-indigo-100' : ''}`}
                          onClick={() => {
                            selectLecture(currentCourse.id, module.id, module.lectures[0].id);
                            setActiveTab('quiz');
                          }}
                        >
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100 text-purple-600">
                            <LucideIcons.HelpCircle className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${activeTab === 'quiz' && module.id === currentModule.id ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>
                              Module Quiz
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <LucideIcons.User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Student User</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video player and content */}
        <div className="flex-1 overflow-y-auto">
          {/* Course header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentCourse.title}</h1>
                <p className="text-sm text-gray-600">Instructor: {currentCourse.instructor}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <LucideIcons.Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <LucideIcons.HelpCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Video player and content tabs */}
          <div className="bg-white">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'content' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('content')}
                >
                  Lecture Content
                </button>
                {currentModule.quiz && (
                  <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'quiz' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveTab('quiz')}
                  >
                    Module Quiz
                  </button>
                )}
              </nav>
            </div>

            {/* Content area */}
            {activeTab === 'content' ? (
              <div>
                {/* Video player */}
                <div className="bg-black relative">
                  <video
                    ref={videoRef}
                    src={currentLecture.videoUrl}
                    className="w-full aspect-video"
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  
                  {/* Video controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-white hover:text-indigo-300 transition-colors"
                        onClick={togglePlay}
                      >
                        {isPlaying ? (
                          <LucideIcons.Pause className="w-6 h-6" />
                        ) : (
                          <LucideIcons.Play className="w-6 h-6" />
                        )}
                      </button>
                      
                      <div className="flex-1 flex items-center space-x-2">
                        <span className="text-xs text-white">{formatTime(currentTime)}</span>
                        <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-white">{formatTime(duration)}</span>
                      </div>
                      
                      <button
                        className="text-white hover:text-indigo-300 transition-colors"
                        onClick={() => setShowNotes(!showNotes)}
                      >
                        <LucideIcons.NotebookText className="w-6 h-6" />
                      </button>
                      
                      <button
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${currentLecture.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        onClick={() => markLectureCompleted(currentLecture.id, !currentLecture.completed)}
                      >
                        {currentLecture.completed ? (
                          <>
                            <LucideIcons.Check className="w-4 h-4" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <LucideIcons.Play className="w-4 h-4" />
                            <span>Mark Complete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Bookmarks timeline */}
                  {currentLecture.bookmarks.length > 0 && (
                    <div className="absolute bottom-16 left-0 right-0 h-1 bg-gray-800/50">
                      {currentLecture.bookmarks.map(bookmark => (
                        <button
                          key={bookmark.id}
                          className="absolute -top-2 w-4 h-4 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors"
                          style={{ left: `${(bookmark.time / duration) * 100}%` }}
                          onClick={() => seekTo(bookmark.time)}
                          title={bookmark.note}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Lecture title and actions */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{currentLecture.title}</h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                        <LucideIcons.Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                        <LucideIcons.Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lecture description */}
                <div className="p-4 border-b border-gray-200">
                  <p className="text-gray-700">
                    This lecture covers the fundamental concepts of {currentLecture.title.split(' ').slice(-1)[0]}. 
                    You'll learn how to apply these concepts in real-world scenarios and understand 
                    the underlying principles that make them work.
                  </p>
                </div>

                {/* Bookmarks section */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                      <LucideIcons.Bookmark className="w-5 h-5 text-indigo-600" />
                      <span>Bookmarks</span>
                    </h3>
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      onClick={() => {
                        if (newBookmarkText) {
                          addBookmark();
                        } else {
                          seekTo(currentTime);
                          setNewBookmarkText(`Bookmark at ${formatTime(currentTime)}`);
                        }
                      }}
                    >
                      Add Bookmark
                    </button>
                  </div>
                  
                  {newBookmarkText && (
                    <div className="mb-4 flex items-start space-x-2">
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Add a note for this bookmark..."
                        value={newBookmarkText}
                        onChange={(e) => setNewBookmarkText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addBookmark();
                          } else if (e.key === 'Escape') {
                            setNewBookmarkText('');
                          }
                        }}
                        autoFocus
                      />
                      <button
                        className="p-2 text-indigo-600 hover:text-indigo-800"
                        onClick={addBookmark}
                      >
                        <LucideIcons.Check className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setNewBookmarkText('')}
                      >
                        <LucideIcons.X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {currentLecture.bookmarks.length > 0 ? (
                    <div className="space-y-3">
                      {currentLecture.bookmarks.map(bookmark => (
                        <div key={bookmark.id} className="flex items-start space-x-3 group">
                          <button
                            className="mt-1 p-1 text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => seekTo(bookmark.time)}
                          >
                            <LucideIcons.Play className="w-4 h-4" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700">{bookmark.note}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(bookmark.time)} • {new Date(bookmark.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            className="mt-1 p-1 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeBookmark(bookmark.id)}
                          >
                            <LucideIcons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <LucideIcons.Bookmark className="w-8 h-8 mx-auto text-gray-300" />
                      <p className="mt-2">No bookmarks yet</p>
                      <p className="text-sm mt-1">Add bookmarks to easily revisit important moments</p>
                    </div>
                  )}
                </div>

                                {/* Notes section (toggleable) */}
                {showNotes && (
                  <div ref={notesSectionRef} className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                        <LucideIcons.NotebookText className="w-5 h-5 text-indigo-600" />
                        <span>Lecture Notes</span>
                      </h3>
                      <button
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        onClick={() => {
                          if (newNoteText) {
                            addNote();
                          } else {
                            setNewNoteText(`Note at ${formatTime(currentTime)}`);
                          }
                        }}
                      >
                        Add Note
                      </button>
                    </div>
                    
                    {newNoteText && (
                      <div className="mb-4 flex flex-col space-y-2">
                        <textarea
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                          placeholder="Write your note here..."
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          autoFocus
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            onClick={addNote}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            onClick={() => setNewNoteText('')}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {currentLecture.notes.length > 0 ? (
                      <div className="space-y-4">
                        {currentLecture.notes.map(note => (
                          <div key={note.id} className="group relative bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                              {note.timestamp !== undefined && (
                                <button
                                  className="text-xs text-indigo-600 hover:text-indigo-800 mb-2"
                                  onClick={() => seekTo(note.timestamp!)}
                                >
                                  {formatTime(note.timestamp)}
                                </button>
                              )}
                              <button
                                className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeNote(note.id)}
                              >
                                <LucideIcons.Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div
                              className="prose prose-sm max-w-none"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateNote(note.id, e.currentTarget.textContent || '')}
                            >
                              {note.content}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(note.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <LucideIcons.NotebookText className="w-8 h-8 mx-auto text-gray-300" />
                        <p className="mt-2">No notes yet</p>
                        <p className="text-sm mt-1">Add notes to capture your thoughts and key learnings</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Quiz tab content */
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{currentModule.title} Quiz</h2>
                
                {quizSubmitted ? (
                  <div className="text-center py-8">
                    <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${quizScore && quizScore >= (currentModule.quiz?.passingScore || 0) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {quizScore && quizScore >= (currentModule.quiz?.passingScore || 0) ? (
                        <LucideIcons.CheckCircle2 className="w-12 h-12" />
                      ) : (
                        <LucideIcons.AlertCircle className="w-12 h-12" />
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {quizScore && quizScore >= (currentModule.quiz?.passingScore || 0) 
                        ? 'Congratulations! You passed!' 
                        : 'Quiz not passed'}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Your score: {quizScore}% (Passing: {currentModule.quiz?.passingScore}%)
                    </p>
                    <div className="mt-6">
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizScore(null);
                        }}
                      >
                        Retake Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {currentModule.quiz?.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-5">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`${question.id}-${optionIndex}`}
                                name={question.id}
                                checked={question.userAnswer === optionIndex}
                                onChange={() => handleAnswerSelect(question.id, optionIndex)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`${question.id}-${optionIndex}`}
                                className="ml-3 block text-gray-700"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end">
                      <button
                        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                        onClick={submitQuiz}
                      >
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELearningPlatform;