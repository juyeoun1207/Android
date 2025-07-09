<프로젝트 이름>
잔소리

<프로젝트 설명>
1. 한 줄 소개
디지털 디톡스를 행동으로 인증하는 앱입니다.

2. 슬로건
행동으로 인증하고, 동기로 극복하자.

3. 사용된 기술
React Native / Expo – 앱 프론트엔드 개발
Zustand – 상태 관리
expo-av – 알림 음성 재생
react-native-calendars – 성취도 캘린더
AsyncStorage – 로컬 기록 저장
카메라 API – 인증 사진 촬영
실시간 사용 시간 API (e.g. UsageStats) – 앱 사용 추적


4. 페이지별 기능
4-1. 홈 탭
- 주간 성공률, 평균 사용 시간, 요일별 사용량 그래프 제공
- 앱별 실시간 사용량 시각화
- 사용량에 따라 시각적 강조

4-2. 캘린더 탭
- 하루별 인증 여부 시각화 ('실패' 표시 포함)
- 대표 사진 설정 및 모달 보기 기능
- 인증 사진 캘린더에 자동 저장
- 이미지 다운로드 기능

4-3. 앱 상세 페이지
- 앱별 사용 시간 통계
- 시간 제한 설정/해제 기능
- 성취도 캘린더 및 리포트 제공
- 목표 달성 시 사진 수동 추가 가능

4-4. 알림 설정 탭
- 알림 소리/진동/글귀 설정
- 기본 문구 + 방탄소년단/아일릿 에디션 + 직접 입력
- 모든 문구는 AI 보이스로 음성 안내


5. 향후 확장 계획
- 실제 K-POP 아티스트와의 협업으로 음성 알림 확대
- 사용자 간 인증 공유 기능
- 일별 리포트 자동 생성 및 PDF 저장 기능


<팀원>
1. 은주연
- 고려대 독어독문학과 23학번

2. 나현호
- 카이스트 전산학부 22학번


<실행사진>
![Screenshot_20250709-161604_MyFirstApp](https://github.com/user-attachments/assets/268ba3f5-a02f-4bd4-9e78-c943f411e426)
![Screenshot_20250709-161625_MyFirstApp](https://github.com/user-attachments/assets/b7bd5eb3-0b1b-454a-a780-f5fba1b2049d)
![Screenshot_20250709-161651_MyFirstApp](https://github.com/user-attachments/assets/498bc4c1-8344-4b08-932b-33430c437b2c)
![Screenshot_20250709-161744_MyFirstApp](https://github.com/user-attachments/assets/57c59c3d-04ec-457c-9d3c-bd88fd269af0)
![Screenshot_20250709-161736_MyFirstApp](https://github.com/user-attachments/assets/a8b790f3-e5ed-43a9-b5bf-497fe87b1dfd)



<APK>
https://drive.google.com/file/d/1JuDiz5hhWONxCf3P3O9nT-ScKSBllgMK/view?usp=sharing




































This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
