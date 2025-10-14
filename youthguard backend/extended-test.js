/**
 * Extended test script to verify all YouthGuard API endpoints
 */

const http = require('http');

console.log('🧪 Testing YouthGuard Extended API endpoints...\n');

// Generate unique data for testing
const timestamp = Date.now();
const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test.user.${timestamp}@example.com`,
    password: 'SecurePass123!',
    phoneNumber: '+2348123456785',
    dateOfBirth: '2000-01-01',
    gender: 'male',
    location: {
        state: 'Lagos',
        city: 'Ikeja'
    }
};

let userId = null;
let courseId = null;
let jobId = null;
let applicationId = null;

// Test health endpoint
console.log('1. Testing health endpoint...');
const healthReq = http.get('http://localhost:5000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('   ✅ Health check response:', data);
        
        // Test user registration
        console.log('\n2. Testing user registration...');
        const postData = JSON.stringify(testUser);
        
        const regOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const regReq = http.request(regOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('   ✅ Registration response status:', res.statusCode);
                if (res.statusCode === 201) {
                    const response = JSON.parse(data);
                    userId = response.data._id;
                    console.log('   ✅ User registered successfully! User ID:', userId);
                    
                    // Test course creation
                    console.log('\n3. Testing course creation...');
                    const courseData = JSON.stringify({
                        title: 'Introduction to Cybersecurity',
                        description: 'Learn the basics of cybersecurity to protect yourself and others',
                        category: 'Technology',
                        instructor: 'Dr. Smith',
                        duration: 10,
                        difficulty: 'Beginner',
                        createdBy: userId
                    });
                    
                    const courseOptions = {
                        hostname: 'localhost',
                        port: 5000,
                        path: '/api/courses',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(courseData)
                        }
                    };
                    
                    const courseReq = http.request(courseOptions, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => {
                            console.log('   ✅ Course creation response status:', res.statusCode);
                            if (res.statusCode === 201) {
                                const response = JSON.parse(data);
                                courseId = response.data._id;
                                console.log('   ✅ Course created successfully! Course ID:', courseId);
                                
                                // Test job creation
                                console.log('\n4. Testing job creation...');
                                const jobData = JSON.stringify({
                                    title: 'Junior Cybersecurity Analyst',
                                    description: 'Entry-level position for cybersecurity professionals',
                                    company: 'Tech Security Ltd',
                                    location: 'Lagos',
                                    jobType: 'Full-time',
                                    salaryMin: 150000,
                                    salaryMax: 250000,
                                    requirements: ['Basic cybersecurity knowledge', 'Good communication skills'],
                                    skills: ['Cybersecurity', 'Networking'],
                                    applicationDeadline: new Date(Date.now() + 30*24*60*60*1000).toISOString(), // 30 days from now
                                    postedBy: userId
                                });
                                
                                const jobOptions = {
                                    hostname: 'localhost',
                                    port: 5000,
                                    path: '/api/jobs',
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Content-Length': Buffer.byteLength(jobData)
                                    }
                                };
                                
                                const jobReq = http.request(jobOptions, (res) => {
                                    let data = '';
                                    res.on('data', chunk => data += chunk);
                                    res.on('end', () => {
                                        console.log('   ✅ Job creation response status:', res.statusCode);
                                        if (res.statusCode === 201) {
                                            const response = JSON.parse(data);
                                            jobId = response.data._id;
                                            console.log('   ✅ Job created successfully! Job ID:', jobId);
                                            
                                            // Test job application
                                            console.log('\n5. Testing job application...');
                                            const applicationData = JSON.stringify({
                                                jobId: jobId,
                                                applicantId: userId,
                                                coverLetter: 'I am very interested in this position and have the required skills.',
                                                resumeUrl: 'https://example.com/resume.pdf'
                                            });
                                            
                                            const appOptions = {
                                                hostname: 'localhost',
                                                port: 5000,
                                                path: '/api/jobs/apply',
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Content-Length': Buffer.byteLength(applicationData)
                                                }
                                            };
                                            
                                            const appReq = http.request(appOptions, (res) => {
                                                let data = '';
                                                res.on('data', chunk => data += chunk);
                                                res.on('end', () => {
                                                    console.log('   ✅ Application response status:', res.statusCode);
                                                    if (res.statusCode === 201) {
                                                        const response = JSON.parse(data);
                                                        applicationId = response.data._id;
                                                        console.log('   ✅ Application submitted successfully! Application ID:', applicationId);
                                                        
                                                        // Test message sending
                                                        console.log('\n6. Testing message sending...');
                                                        const messageData = JSON.stringify({
                                                            senderId: userId,
                                                            receiverId: userId, // Sending to self for testing
                                                            content: 'Hello, this is a test message!'
                                                        });
                                                        
                                                        const messageOptions = {
                                                            hostname: 'localhost',
                                                            port: 5000,
                                                            path: '/api/messages',
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Content-Length': Buffer.byteLength(messageData)
                                                            }
                                                        };
                                                        
                                                        const messageReq = http.request(messageOptions, (res) => {
                                                            let data = '';
                                                            res.on('data', chunk => data += chunk);
                                                            res.on('end', () => {
                                                                console.log('   ✅ Message sending response status:', res.statusCode);
                                                                if (res.statusCode === 201) {
                                                                    console.log('   ✅ Message sent successfully!');
                                                                    
                                                                    // Test progress tracking
                                                                    console.log('\n7. Testing progress tracking...');
                                                                    const progressData = JSON.stringify({
                                                                        userId: userId,
                                                                        courseId: courseId,
                                                                        lessonId: '68edc5e4d8bf5c9d1402dbd9', // Mock lesson ID
                                                                        completionStatus: 'Completed',
                                                                        timeSpent: 30,
                                                                        score: 85
                                                                    });
                                                                    
                                                                    const progressOptions = {
                                                                        hostname: 'localhost',
                                                                        port: 5000,
                                                                        path: '/api/progress',
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'Content-Length': Buffer.byteLength(progressData)
                                                                        }
                                                                    };
                                                                    
                                                                    const progressReq = http.request(progressOptions, (res) => {
                                                                        let data = '';
                                                                        res.on('data', chunk => data += chunk);
                                                                        res.on('end', () => {
                                                                            console.log('   ✅ Progress tracking response status:', res.statusCode);
                                                                            if (res.statusCode === 200) {
                                                                                console.log('   ✅ Progress tracked successfully!');
                                                                                console.log('\n🎉 All extended tests completed successfully!');
                                                                                console.log('🚀 The YouthGuard extended backend is working correctly!');
                                                                            } else {
                                                                                console.log('   ❌ Progress tracking failed:', data);
                                                                            }
                                                                        });
                                                                    });
                                                                    
                                                                    progressReq.on('error', (error) => {
                                                                        console.error('   ❌ Progress tracking error:', error.message);
                                                                    });
                                                                    
                                                                    progressReq.write(progressData);
                                                                    progressReq.end();
                                                                } else {
                                                                    console.log('   ❌ Message sending failed:', data);
                                                                }
                                                            });
                                                        });
                                                        
                                                        messageReq.on('error', (error) => {
                                                            console.error('   ❌ Message sending error:', error.message);
                                                        });
                                                        
                                                        messageReq.write(messageData);
                                                        messageReq.end();
                                                    } else {
                                                        console.log('   ❌ Application failed:', data);
                                                    }
                                                });
                                            });
                                            
                                            appReq.on('error', (error) => {
                                                console.error('   ❌ Application error:', error.message);
                                            });
                                            
                                            appReq.write(applicationData);
                                            appReq.end();
                                        } else {
                                            console.log('   ❌ Job creation failed:', data);
                                        }
                                    });
                                });
                                
                                jobReq.on('error', (error) => {
                                    console.error('   ❌ Job creation error:', error.message);
                                });
                                
                                jobReq.write(jobData);
                                jobReq.end();
                            } else {
                                console.log('   ❌ Course creation failed:', data);
                            }
                        });
                    });
                    
                    courseReq.on('error', (error) => {
                        console.error('   ❌ Course creation error:', error.message);
                    });
                    
                    courseReq.write(courseData);
                    courseReq.end();
                } else {
                    console.log('   ❌ Registration failed:', data);
                }
            });
        });
        
        regReq.on('error', (error) => {
            console.error('   ❌ Registration error:', error.message);
        });
        
        regReq.write(postData);
        regReq.end();
    });
});

healthReq.on('error', (error) => {
    console.error('   ❌ Health check error:', error.message);
});