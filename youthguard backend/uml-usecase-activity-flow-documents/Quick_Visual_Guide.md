# Quick Visual Diagram Generation Guide

## Step-by-Step Instructions

### Option 1: Online PlantUML (Recommended - Easiest)

1. **Go to**: [http://www.plantuml.com/plantuml/uml](http://www.plantuml.com/plantuml/uml)

2. **Copy content from any of these files**:
   - `YouthGuard_Class_Diagram_Visual.puml` - For class relationships
   - `YouthGuard_UseCase_Visual.puml` - For use case relationships  
   - `YouthGuard_Activity_Visual.puml` - For process flows
   - `YouthGuard_Sequence_Visual.puml` - For system interactions

3. **Paste into the online editor**

4. **Click "Submit"** - You'll see the visual diagram immediately

5. **Right-click the diagram and "Save image as..."** to download

### Option 2: VS Code (If you have it)

1. **Install PlantUML extension** in VS Code
2. **Open any `.puml` file**
3. **Press Alt + D** to preview
4. **Right-click preview to export**

## Your Visual Diagrams Will Show:

### Class Diagram (`YouthGuard_Class_Diagram_Visual.puml`)
- **Boxes** for each class (User, Youth, Mentor, etc.)
- **Lines with arrows** showing inheritance (User → Youth)
- **Lines with numbers** showing relationships (1 to many, etc.)
- **Attributes and methods** listed in each box

### Use Case Diagram (`YouthGuard_UseCase_Visual.puml`) 
- **Stick figures** for actors (Youth, Mentor, Employer, Admin)
- **Ovals** for use cases (Register, Login, Browse Courses, etc.)
- **Lines** connecting actors to their use cases
- **Include/Extend** relationships with dotted lines

### Activity Diagram (`YouthGuard_Activity_Visual.puml`)
- **Rounded rectangles** for activities 
- **Diamonds** for decision points (Yes/No branches)
- **Arrows** showing flow direction
- **Start/Stop** circles

### Sequence Diagram (`YouthGuard_Sequence_Visual.puml`)
- **Vertical lines** for each system component
- **Horizontal arrows** for messages between components
- **Timeline** from top to bottom
- **Activation boxes** showing when components are active

## Expected Output Quality
Your diagrams will be:
- **Professional quality** - suitable for presentations
- **High resolution** - clear when printed or projected  
- **Properly formatted** - following UML standards
- **Color coded** - different colors for different elements

## For Your Capstone Project
1. **Generate all 4 visual diagrams**
2. **Save as PNG or PDF files**  
3. **Include in your presentation slides**
4. **Reference the relationships shown in your analysis**

## Troubleshooting
- If a diagram doesn't render, check for syntax errors
- Make sure all brackets `{}` and parentheses `()` are balanced
- PlantUML is case-sensitive

**Total time needed**: 5-10 minutes to generate all visual diagrams