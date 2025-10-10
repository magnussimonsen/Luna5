// Default Python code for new Python cells
export const newPythonCellExampleCode = `from pylab import *
figure(figsize=(9,6))
# Generate x values
x = linspace(0, 4*pi, 500)  # from 0 to 4π, 500 points
# Define functions
y1 = sin(3*x)
y2 = sin(x)
# Plot it
plot(x, y1, label='sin(3$\\cdot$x)', color='green')
plot(x, y2, label='sin(x)', color='red')
xlabel('x')
ylabel('Amplitude')
title('Sine waves')
legend(loc='upper right') 
grid(True)
show()`
