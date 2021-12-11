import cv2 as cv
from fer import FER

cap = cv.VideoCapture(0)
emotion_detector = FER(mtcnn=True)

while cap.isOpened():

    ret, frame = cap.read()

    if not ret:
        print("Error occured")
        break

    d, s = FER.top_emotion(emotion_detector, frame)
    
    cv.putText(frame, d, (10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    cv.imshow("Emotion detetion", frame)

    if cv.waitKey(1) == ord('q'):
        break

cap.release()
cv.destroyAllWindows()