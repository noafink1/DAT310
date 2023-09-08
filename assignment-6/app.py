"""
Flask: Using templates
"""

from setup_db import select_students, select_courses, select_grades, add_student
from setup_db import add_grade as add_grade_func
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, g
from random import randrange

app = Flask(__name__)

def count_grades(course_id, grades):
    grade_count = []
    grade_list = ['A','B','C','D','E','F']
    for g in grade_list:
        counter = 0
        for grade in grades:
            if course_id == grade['course_id']:
                if g == grade['grade']:
                    counter+=1
        dictonary = {"grade":g, "count":counter}
        grade_count.append(dictonary)
    return grade_count

DATABASE = './database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route("/", methods=["POST", "GET"])
def index():
    # get the database connection
    conn = get_db()
    if request.method == "POST":

        #-------Add New Student-------#
        name =  request.form["name"]
        student_no = randrange(100000,999999)
        if len(name)>0:
            add_student(conn,student_no,name)
        else:
            return render_template("student_form_error.html")

    return render_template("index.html", students=select_students(conn), courses=select_courses(conn))


@app.route("/student/<student_no>")
def student(student_no):
    conn = get_db()
    return render_template("student.html", student_no=student_no, grades=select_grades(conn), students=select_students(conn), courses=select_courses(conn))

@app.route("/course/<course_id>")
def course(course_id):
    conn = get_db()
    grade_count = count_grades(course_id, select_grades(conn))
            
    return render_template("course.html", course_id=course_id, grade_count=grade_count, grades=select_grades(conn))

@app.route("/new_student")
def new_student():
    conn = get_db()

    return render_template("student_form.html")

@app.route("/add_grade", methods=["POST", "GET"])
def add_grade():
    conn = get_db()
    course_id = None
    student_no = None
    add_grade_route = None
    if request.method == "POST":
        try:
            #-------Add New Grade-------#
            add_grade_route = request.form["add_grade"]
            #Coming from add_grade back to add_grade after adding a new grade
            if add_grade_route == "add_grade":
                course = request.form.get('course')
                student = request.form.get('stud')
                grade = request.form.get('grade')
                if len(str(course)) > 0 and len(str(student)) > 0 and len(str(grade)) > 0:
                    add_grade_func(conn, course, student, grade)
                    return render_template("add_grade_success.html", course=course, student=student, grade=grade, students=select_students(conn), courses=select_courses(conn))
                else:
                    return render_template("add_grade_error.html", students=select_students(conn), courses=select_courses(conn))
        except KeyError:
            add_grade_route = None
        try:
            #Coming from course
            course_id = request.form["course"]
        except KeyError:
            course_id = None 
        try:
            #Coming from student
            student_no = request.form["student"]
        except KeyError:
            student_no = None
        return render_template("add_grade.html", course_id=course_id, student_no=student_no, students=select_students(conn), courses=select_courses(conn))

    return render_template("add_grade.html", course_id=course_id, student_no=student_no, students=select_students(conn), courses=select_courses(conn))



if __name__ == "__main__":
    app.run(debug=True)
