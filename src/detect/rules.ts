import { finding, lines, occurrences, type Detector, type Finding } from './types.js'

const DART = ['.dart']
const XML = ['.xml']
const BOTH = [...DART, ...XML]

/** Anything in the file that makes a widget pressable. */
const PRESSABLE =
	/GestureDetector|InkWell|IconButton|TextButton|ElevatedButton|OutlinedButton|FilledButton|onTap:|onPressed:/

const SCREEN = /Scaffold|CupertinoPageScaffold/

/** A literal size in a Flutter text style, which the type scale should own. */
const detectTypeScale: Detector = {
	rule: 'type-scale',
	extensions: BOTH,
	run(file, source) {
		const found: Finding[] = []

		for (const { line, text } of lines(source)) {
			if (file.endsWith('.dart') && /\bfontSize:\s*\d/.test(text)) {
				found.push(
					finding('type-scale', file, line, text, 'a literal font size, where a text style should carry it'),
				)
			}
			const android = /android:textSize="(\d+(?:\.\d+)?)(dp|px|sp)"/.exec(text)
			if (android && android[2] !== 'sp') {
				found.push(
					finding('type-scale', file, line, text, `text sized in ${android[2]}, which does not follow the user's setting`),
				)
			}
		}

		return found
	},
}

/** A pressable drawn smaller than the platform floor. */
const detectTouchFloor: Detector = {
	rule: 'touch-floor',
	extensions: BOTH,
	run(file, source) {
		const found: Finding[] = []
		const pressable = PRESSABLE.test(source)

		for (const { line, text } of lines(source)) {
			if (file.endsWith('.dart') && pressable) {
				for (const match of text.matchAll(/\b(width|height|size|minWidth|minHeight):\s*(\d+(?:\.\d+)?)/g)) {
					const value = Number(match[2])
					if (value > 0 && value < 48) {
						found.push(
							finding('touch-floor', file, line, text, `${match[1]} of ${value} on a file that draws a pressable, under the 48dp floor`),
						)
					}
				}
			}

			const android = /android:(minWidth|minHeight|layout_width|layout_height)="(\d+(?:\.\d+)?)dp"/.exec(text)
			if (android && Number(android[2]) > 0 && Number(android[2]) < 48 && /clickable="true"|Button/.test(source)) {
				found.push(
					finding('touch-floor', file, line, text, `${android[1]} of ${android[2]}dp on a clickable view, under the 48dp floor`),
				)
			}
		}

		return found
	},
}

/** A screen that never reads an inset. */
const detectLayoutInsets: Detector = {
	rule: 'layout-insets',
	extensions: DART,
	run(file, source) {
		if (!SCREEN.test(source)) {
			return []
		}
		if (/SafeArea|viewPadding|viewInsets|MediaQuery\.(of\(context\)\.)?padding|padding\.of\(context\)/.test(source)) {
			return []
		}

		const at = lines(source).find(({ text }) => SCREEN.test(text))
		return [
			finding(
				'layout-insets',
				file,
				at?.line ?? 0,
				at?.text ?? '',
				'a screen with no inset read anywhere in the file',
			),
		]
	},
}

/** An icon-only control with nothing to announce. */
const detectA11yName: Detector = {
	rule: 'a11y-name',
	extensions: BOTH,
	run(file, source) {
		const found: Finding[] = []

		if (file.endsWith('.dart')) {
			for (const { line, text, window } of occurrences(source, /IconButton\(/)) {
				if (!/tooltip:/.test(window) && !/Semantics\(|semanticsLabel|semanticLabel/.test(window)) {
					found.push(
						finding('a11y-name', file, line, text, 'an IconButton with neither a tooltip nor a Semantics label'),
					)
				}
			}
		}

		for (const { line, text, window } of occurrences(source, /<ImageButton|<ImageView/, 400)) {
			if (file.endsWith('.xml') && !/android:contentDescription/.test(window)) {
				found.push(
					finding('a11y-name', file, line, text, 'an image control with no contentDescription on it'),
				)
			}
		}

		return found
	},
}

/** A field that arrives with the wrong keyboard and no autofill. */
const detectFormInput: Detector = {
	rule: 'form-input',
	extensions: BOTH,
	run(file, source) {
		const found: Finding[] = []

		if (file.endsWith('.dart')) {
			for (const { line, text, window } of occurrences(source, /\bTextF(?:ield|ormField)\(/)) {
				if (!/keyboardType:/.test(window)) {
					found.push(
						finding('form-input', file, line, text, 'a text field with no keyboardType, so every field opens the same keyboard'),
					)
				}
			}
		}

		for (const { line, text, window } of occurrences(source, /<EditText/, 400)) {
			if (file.endsWith('.xml') && !/android:inputType/.test(window)) {
				found.push(finding('form-input', file, line, text, 'an EditText with no inputType'))
			}
		}

		return found
	},
}

/** A field that the platform cannot fill. */
const detectFormAutofill: Detector = {
	rule: 'form-autofill',
	extensions: DART,
	run(file, source) {
		const found: Finding[] = []

		for (const { line, text, window } of occurrences(source, /\bTextF(?:ield|ormField)\(/)) {
			if (!/autofillHints:/.test(window)) {
				found.push(
					finding('form-autofill', file, line, text, 'a text field with no autofillHints, which the platform cannot fill'),
				)
			}
		}

		return found
	},
}

/** A client built without a deadline. */
const detectNetTimeout: Detector = {
	rule: 'net-timeout',
	extensions: DART,
	run(file, source) {
		const found: Finding[] = []
		const configured = /connectTimeout|receiveTimeout|sendTimeout|\.timeout\(/.test(source)

		for (const { line, text } of lines(source)) {
			if (/\b(http\.Client\(\)|Dio\(|IOClient\()/.test(text) && !configured) {
				found.push(
					finding('net-timeout', file, line, text, 'an HTTP client with no timeout anywhere in the file'),
				)
			}
			if (/\bawait\s+http\.(get|post|put|delete|patch)\(/.test(text) && !/\.timeout\(/.test(text) && !configured) {
				found.push(
					finding('net-timeout', file, line, text, 'a request with no deadline on it'),
				)
			}
		}

		return found
	},
}

/** Text the catalogue never saw. */
const detectL10nStrings: Detector = {
	rule: 'l10n-strings',
	extensions: DART,
	run(file, source) {
		const found: Finding[] = []

		for (const { line, text } of lines(source)) {
			const match = /\b(Text|SelectableText)\(\s*(['"])([^'"]{4,})\2/.exec(text)
			if (!match) {
				continue
			}
			const literal = match[3]!
			if (!/[a-zA-Z]{3}/.test(literal) || /^\$/.test(literal)) {
				continue
			}
			found.push(
				finding('l10n-strings', file, line, text, `"${literal.slice(0, 40)}" is user-facing text written in code`),
			)
		}

		return found
	},
}

/** Motion that never reads the system setting. */
const detectMotionReduced: Detector = {
	rule: 'motion-reduced',
	extensions: DART,
	run(file, source) {
		if (!/AnimationController|AnimatedContainer|TweenAnimationBuilder|\.animate\(/.test(source)) {
			return []
		}
		if (/disableAnimations|reduceMotion|accessibleNavigation/.test(source)) {
			return []
		}

		const at = lines(source).find(({ text }) => /AnimationController|AnimatedContainer|TweenAnimationBuilder|\.animate\(/.test(text))
		return [
			finding(
				'motion-reduced',
				file,
				at?.line ?? 0,
				at?.text ?? '',
				'animation with no read of the reduced-motion setting in the file',
			),
		]
	},
}

/** A list built without recycling. */
const detectListVirtualise: Detector = {
	rule: 'list-virtualise',
	extensions: DART,
	run(file, source) {
		const found: Finding[] = []

		for (const { line, text, window } of occurrences(source, /\b(?:Column|ListBody)\(/)) {
			if (/\.\.\.\w+\.map\(|\.\.\.\w+\.entries|for \(final/.test(window)) {
				found.push(
					finding('list-virtualise', file, line, text, 'rows expanded into a Column, which builds every one of them'),
				)
			}
		}

		for (const { line, text, window } of occurrences(source, /\bListView\(/, 120)) {
			if (/children:/.test(window)) {
				found.push(
					finding('list-virtualise', file, line, text, 'a ListView with a children list rather than a builder'),
				)
			}
		}

		return found
	},
}

export const DETECTORS: Detector[] = [
	detectTypeScale,
	detectTouchFloor,
	detectLayoutInsets,
	detectA11yName,
	detectFormInput,
	detectFormAutofill,
	detectNetTimeout,
	detectL10nStrings,
	detectMotionReduced,
	detectListVirtualise,
]
