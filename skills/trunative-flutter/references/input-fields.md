# Input fields

Lookup only. The rules live in `heuristics/forms.md`. Open this file for one field's keyboard or autofill name, not as background reading.

Two settings per field, and they are separate: the keyboard decides what the user can type, the content type decides what the platform can fill in for them. Setting one does not set the other.

## Keyboard type

| Field | Flutter `TextInputType` |
|---|---|
| email | `.emailAddress` |
| telephone | `.phone` |
| whole number | `.number` |
| money or measure | `.numberWithOptions(decimal: true)` |
| URL | `.url` |
| search | `.text` |
| password | `.visiblePassword` where shown |
| multi-line note | `.multiline` |

Card numbers and one time codes are numeric keyboards over a text field, never a number field. A number field brings steppers, drops leading zeros, and on the web turns a mistyped digit into a scroll event.

## Return key

| Meaning | Flutter |
|---|---|
| next field | `TextInputAction.next` |
| last field | `TextInputAction.done` |
| submit now | `TextInputAction.go` |
| search | `TextInputAction.search` |

## Autofill content type

| Value | Flutter `AutofillHints` |
|---|---|
| email | `.email` |
| username | `.username` |
| existing password | `.password` |
| new password | `.newPassword` |
| one time code | `.oneTimeCode` |
| full name | `.name` |
| given name | `.givenName` |
| family name | `.familyName` |
| telephone | `.telephoneNumber` |
| street | `.streetAddressLine1` |
| city | `.addressCity` |
| postal code | `.postalCode` |
| country | `.countryName` |
| card number | `.creditCardNumber` |
| card expiry | `.creditCardExpirationDate` |
| security code | `.creditCardSecurityCode` |

On iOS, the same attribute is `textContentType` on `UITextField` and a prop of the same name in React Native, which is the one that drives fill on that platform.

On Android, the Compose semantics property landed in Compose 1.8; view layouts use `android:autofillHints` with the `AUTOFILL_HINT_*` string of the same meaning.

## Grouping and saving

A credential is filled and saved as a set, so the fields have to be declared as one.

- Flutter: wrap the fields in `AutofillGroup`, then call `TextInput.finishAutofillContext()` on submit.

## One time codes

One field, numeric keyboard, the one time code content type. The platform reads the message and offers the digits above the keyboard.

- iOS fills from Messages with no extra work once `.oneTimeCode` is set.
- Android reads the SMS through the SMS Retriever API, or the User Consent API where the message is not formatted for retrieval.
- Mobile web can additionally use the WebOTP API through `navigator.credentials.get()` with an `otp` request.

## Capitalisation and correction

| Field | Capitalisation | Autocorrect |
|---|---|---|
| email, username, password, code, URL | none | off |
| person or street name | words | off |
| free text, note, message | sentences | on |

The names of these settings: `.textInputAutocapitalization()` and `.autocorrectionDisabled()` in SwiftUI, `KeyboardOptions(capitalization =, autoCorrectEnabled =)` in Compose, `textCapitalization` and `autocorrect` in Flutter, `autoCapitalize` and `autoCorrect` in React Native, `autocapitalize` and `autocorrect` in HTML.
