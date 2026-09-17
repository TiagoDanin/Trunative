# Input fields

Lookup only. The rules live in `heuristics/forms.md`. Open this file for one field's keyboard or autofill name, not as background reading.

Two settings per field, and they are separate: the keyboard decides what the user can type, the content type decides what the platform can fill in for them. Setting one does not set the other.

## Keyboard type

| Field | Compose `KeyboardType` |
|---|---|
| email | `Email` |
| telephone | `Phone` |
| whole number | `Number` |
| money or measure | `Decimal` |
| URL | `Uri` |
| search | `Text` |
| password | `Password` |
| multi-line note | `Text` |

Card numbers and one time codes are numeric keyboards over a text field, never a number field. A number field brings steppers, drops leading zeros, and on the web turns a mistyped digit into a scroll event.

## Return key

| Meaning | Compose |
|---|---|
| next field | `ImeAction.Next` |
| last field | `ImeAction.Done` |
| submit now | `ImeAction.Go` |
| search | `ImeAction.Search` |

## Autofill content type

| Value | Compose `ContentType` |
|---|---|
| email | `EmailAddress` |
| username | `Username` |
| existing password | `Password` |
| new password | `NewPassword` |
| one time code | `SmsOtpCode` |
| full name | `PersonFullName` |
| given name | `PersonFirstName` |
| family name | `PersonLastName` |
| telephone | `PhoneNumber` |
| street | `AddressStreet` |
| city | `AddressLocality` |
| postal code | `PostalCode` |
| country | `AddressCountry` |
| card number | `CreditCardNumber` |
| card expiry | `CreditCardExpirationDate` |
| security code | `CreditCardSecurityCode` |

On iOS, the same attribute is `textContentType` on `UITextField` and a prop of the same name in React Native, which is the one that drives fill on that platform.

On Android, the Compose semantics property landed in Compose 1.8; view layouts use `android:autofillHints` with the `AUTOFILL_HINT_*` string of the same meaning.

## Grouping and saving

A credential is filled and saved as a set, so the fields have to be declared as one.

- Compose: read `LocalAutofillManager` and call `commit()` when the form is submitted, or nothing is offered for saving.

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
