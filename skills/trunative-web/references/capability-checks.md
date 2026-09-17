# Capability presence, status and accuracy, per stack

Lookup only. The rules live in `heuristics/sense.md`, and the grant flow lives in `heuristics/permissions.md`. Open this file for one name, not as background reading.

Nothing here decides anything. Every entry answers one of three questions: does this device have the hardware, is the capability usable right now, and how good is the value it just returned.

## Does the device have it

| Capability | iOS | Android | Mobile web |
|---|---|---|---|
| Any camera | `AVCaptureDevice.DiscoverySession` returns no devices | `PackageManager.hasSystemFeature(FEATURE_CAMERA_ANY)` | `enumerateDevices()` lists no `videoinput` |
| Front camera | discovery session with `.front` | `FEATURE_CAMERA_FRONT` | same, by `deviceId` |
| Microphone | `AVCaptureDevice` for `.audio` | `FEATURE_MICROPHONE` | no `audioinput` in `enumerateDevices()` |
| Location hardware | always present | `FEATURE_LOCATION`, `FEATURE_LOCATION_GPS`, `FEATURE_LOCATION_NETWORK` | `navigator.geolocation` undefined |
| Accelerometer, gyroscope, compass | `CMMotionManager.isGyroAvailable` and siblings | `SensorManager.getDefaultSensor()` returns null; `FEATURE_SENSOR_ACCELEROMETER`, `FEATURE_SENSOR_GYROSCOPE`, `FEATURE_SENSOR_COMPASS` | `DeviceMotionEvent` undefined |
| Biometric reader | `LAContext.canEvaluatePolicy` plus `biometryType` | `BiometricManager.canAuthenticate()` returning `BIOMETRIC_ERROR_NO_HARDWARE`; `FEATURE_FINGERPRINT`, `FEATURE_FACE`, `FEATURE_IRIS` | not available |
| Vibration motor | always present | `Vibrator.hasVibrator()` | `navigator.vibrate` undefined |
| Named haptic feedback | `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`, `UISelectionFeedbackGenerator` | `View.performHapticFeedback()` constants, then `VibrationEffect.createPredefined()` | `navigator.vibrate` only |
| Rich haptic patterns | `CHHapticEngine` capabilities | `Vibrator.areEffectsSupported()`, `arePrimitivesSupported()` | not available |

Android's answer for a vibration effect has three values, `VIBRATION_EFFECT_SUPPORT_YES`, `_NO` and `_UNKNOWN`. Unknown means the hardware does not report its effects, so nothing will tell you whether a call produces anything.

Presence and distribution are separate. `<uses-feature android:name="android.hardware.sensor.gyroscope" android:required="false" />` keeps the app installable on devices without the sensor; `required="true"` removes it from the store for them.

## Is it usable right now

| Question | iOS | Android | Web |
|---|---|---|---|
| Permission status | `AVCaptureDevice.authorizationStatus(for:)`, `CLLocationManager.authorizationStatus` | `ContextCompat.checkSelfPermission()` | Permissions API `query()` |
| Location services on | `CLLocationManager.locationServicesEnabled()` | `LocationManager.isProviderEnabled()` | rejection code `POSITION_UNAVAILABLE` |
| Device-wide sensor toggle | not present | `SensorPrivacyManager.supportsSensorToggle(Sensors.CAMERA / Sensors.MICROPHONE)` | not present |
| Hardware held or broken | `AVCaptureSession` runtime error notification | camera provider fails to bind | `NotReadableError` |
| Nothing enrolled | `LAError.biometryNotEnrolled`, `.passcodeNotSet` | `BIOMETRIC_ERROR_NONE_ENROLLED`, then `Settings.ACTION_BIOMETRIC_ENROLL` | not available |
| Locked out | `LAError.biometryLockout` | `BIOMETRIC_ERROR_LOCKOUT` | not available |
| No such device | discovery session empty | provider throws | `NotFoundError` |
| Route to system settings | `UIApplication.openSettingsURLString` | `Settings.ACTION_APPLICATION_DETAILS_SETTINGS`, `ACTION_LOCATION_SOURCE_SETTINGS` | none, the browser owns it |

The iOS biometric error set worth branching on: `biometryNotAvailable`, `biometryNotEnrolled`, `biometryLockout`, `passcodeNotSet`, `userCancel`, `systemCancel`, `appCancel`, `userFallback`. The last one fires when the user asks for a fallback the policy does not have.

## How good is the value

| What | iOS | Android | Web |
|---|---|---|---|
| Horizontal accuracy | `CLLocation.horizontalAccuracy`, a radius in metres, negative meaning the coordinate is invalid | `Location.getAccuracy()`, a radius in metres at the 68th percentile, valid only where `hasAccuracy()` is true and zero otherwise | `coords.accuracy` in metres at 95% confidence |
| Vertical accuracy | `verticalAccuracy` | `getVerticalAccuracyMeters()` | `altitudeAccuracy` |
| Granted accuracy level | `CLAccuracyAuthorization.fullAccuracy` or `.reducedAccuracy` | `ACCESS_FINE_LOCATION` against `ACCESS_COARSE_LOCATION` | not exposed |
| Requested accuracy | `desiredAccuracy` | `Priority` on the location request | `enableHighAccuracy` |
| Upgrade to precise | `requestTemporaryFullAccuracyAuthorization(withPurposeKey:)` with `NSLocationTemporaryUsageDescriptionDictionary` | request the fine and coarse pair again | not available |
| Compass calibration | `CLLocationManager` heading calibration display | `SensorManager.SENSOR_STATUS_ACCURACY_LOW` and siblings through `onAccuracyChanged` | not available |

The three accuracy radii are not the same measurement. A threshold in metres tuned on one platform does not transfer to another.

Published figures: an approximate Android grant is accurate to roughly 3 square kilometres, a precise one usually to within about 50 metres and sometimes a few. Apple states no metric figure for reduced accuracy, so there is nothing to compare it against.

## Sampling ceilings

From Android 12, `SensorManager.registerListener()` is capped at 200 Hz and `SensorDirectChannel` at `RATE_NORMAL`, about 50 Hz. Going past either without `HIGH_SAMPLING_RATE_SENSORS` throws a `SecurityException`. The device-wide microphone and camera toggle rate-limits motion sensors regardless of that permission.

On mobile web, `DeviceMotionEvent.requestPermission()` needs a secure context and transient activation, so it has to run inside a tap handler, and it rejects with `NotAllowedError` otherwise. `navigator.vibrate()` needs sticky user activation. Neither is available in every browser.
