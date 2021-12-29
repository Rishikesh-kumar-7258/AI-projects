import cv2 as cv
import numpy as np

cap = cv.VideoCapture(1) # captures video from webcam
if not cap.isOpened():
    print("Error opening video stream or file")
    exit(0)

# background subtractor
fgbg = cv.createBackgroundSubtractorKNN(history=10, dist2Threshold=75)

while 1:
    ret, frame = cap.read() # captures frame by frame

    if frame is None: break;

    # gray = cv.flip(frame, 1) # flips frame horizontally
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY) # converts frame to grayscale
    gray = fgbg.apply(gray) # applies background subtractor

    # getting contours
    contours, hierarchy = cv.findContours(gray, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

    for contour in contours:
        # gets the bounding rectangle for each contour
        x, y, w, h = cv.boundingRect(contour)
        # draws rectangle around contours
        if w*h >= 10000:
            cv.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # using numpy to convert frame to numpy array
    frame = np.array(frame)

    cv.imshow('Original', frame) # displays video
    cv.imshow('blackscreen', gray) # displays videoqqq

    key = cv.waitKey(1)
    if key == ord('q'):
        break