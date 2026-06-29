// Restored from ref/webview/assets/score-query-match-DS2pZf_b.js
// ScoreQueryMatch chunk restored from the Codex webview bundle.
var scoreQueryMatchValue4 = ["/", "\\"],
  scoreQueryMatchValue6 = class {
    mainMatcher;
    fallbackMatcher;
    constructor(scoreQueryMatchParam118, scoreQueryMatchParam119) {
      this.mainMatcher = scoreQueryMatchParam118;
      this.fallbackMatcher = scoreQueryMatchParam119;
    }
    matchingDegree(scoreQueryMatchParam40) {
      let scoreQueryMatchValue56 = this.mainMatcher.match(
        scoreQueryMatchParam40,
      );
      if (scoreQueryMatchValue56 != null)
        return scoreQueryMatchHelper6(
          this.mainMatcher.matchingDegree(
            scoreQueryMatchParam40,
            false,
            scoreQueryMatchValue56,
          ),
          scoreQueryMatchValue56,
        );
      if (this.fallbackMatcher == null) return -2147483648;
      let scoreQueryMatchValue57 = this.fallbackMatcher.match(
        scoreQueryMatchParam40,
      );
      return scoreQueryMatchValue57 == null
        ? -2147483648
        : scoreQueryMatchHelper6(
            this.fallbackMatcher.matchingDegree(
              scoreQueryMatchParam40,
              false,
              scoreQueryMatchValue57,
            ),
            scoreQueryMatchValue57,
          );
    }
  },
  scoreQueryMatchValue7 = class {
    myPattern;
    isLowerCase;
    isUpperCase;
    isWordSeparator;
    toUpperCase;
    toLowerCase;
    hardSeparators;
    matchingMode;
    mixedCase;
    hasSeparators;
    hasDots;
    meaningfulCharacters;
    minNameLength;
    constructor(
      scoreQueryMatchParam1,
      scoreQueryMatchParam2,
      scoreQueryMatchParam3,
    ) {
      let scoreQueryMatchValue8 = scoreQueryMatchParam1.endsWith("* ")
        ? scoreQueryMatchParam1.slice(0, -2)
        : scoreQueryMatchParam1;
      this.myPattern = Array.from(scoreQueryMatchValue8);
      this.isLowerCase = Array.from(
        {
          length: this.myPattern.length,
        },
        () => false,
      );
      this.isUpperCase = Array.from(
        {
          length: this.myPattern.length,
        },
        () => false,
      );
      this.isWordSeparator = Array.from(
        {
          length: this.myPattern.length,
        },
        () => false,
      );
      this.toUpperCase = Array.from(
        {
          length: this.myPattern.length,
        },
        () => "",
      );
      this.toLowerCase = Array.from(
        {
          length: this.myPattern.length,
        },
        () => "",
      );
      this.hardSeparators = Array.from(scoreQueryMatchParam3);
      this.matchingMode = scoreQueryMatchParam2;
      let scoreQueryMatchValue9 = [],
        scoreQueryMatchValue10 = false,
        scoreQueryMatchValue11 = false,
        _scoreQueryMatch = false,
        scoreQueryMatchValue12 = false,
        scoreQueryMatchValue13 = false;
      for (
        let scoreQueryMatchValue29 = 0;
        scoreQueryMatchValue29 < this.myPattern.length;
        scoreQueryMatchValue29 += 1
      ) {
        let scoreQueryMatchValue33 = this.myPattern[scoreQueryMatchValue29],
          scoreQueryMatchValue34 = scoreQueryMatchHelper7(
            scoreQueryMatchValue33,
          ),
          scoreQueryMatchValue35 = scoreQueryMatchHelper20(
            scoreQueryMatchValue33,
          ),
          scoreQueryMatchValue36 = scoreQueryMatchHelper21(
            scoreQueryMatchValue33,
          ),
          scoreQueryMatchValue37 = scoreQueryMatchValue33.toUpperCase(),
          scoreQueryMatchValue38 = scoreQueryMatchValue33.toLowerCase();
        scoreQueryMatchValue36 && (scoreQueryMatchValue11 = true);
        scoreQueryMatchValue33 === "." && (scoreQueryMatchValue12 = true);
        scoreQueryMatchValue10 &&
          scoreQueryMatchValue35 &&
          (_scoreQueryMatch = true);
        scoreQueryMatchHelper12(scoreQueryMatchValue33) ||
          ((scoreQueryMatchValue10 = true),
          scoreQueryMatchValue9.push(scoreQueryMatchValue38),
          scoreQueryMatchValue9.push(scoreQueryMatchValue37));
        scoreQueryMatchValue10 &&
          scoreQueryMatchValue34 &&
          (scoreQueryMatchValue13 = true);
        this.isWordSeparator[scoreQueryMatchValue29] = scoreQueryMatchValue34;
        this.isUpperCase[scoreQueryMatchValue29] = scoreQueryMatchValue35;
        this.isLowerCase[scoreQueryMatchValue29] = scoreQueryMatchValue36;
        this.toUpperCase[scoreQueryMatchValue29] = scoreQueryMatchValue37;
        this.toLowerCase[scoreQueryMatchValue29] = scoreQueryMatchValue38;
      }
      this.hasDots = scoreQueryMatchValue12;
      this.mixedCase = scoreQueryMatchValue11 && _scoreQueryMatch;
      this.hasSeparators = scoreQueryMatchValue13;
      this.meaningfulCharacters = scoreQueryMatchValue9;
      this.minNameLength = scoreQueryMatchValue9.length / 2;
    }
    get pattern() {
      return this.myPattern.join("");
    }
    matchingDegree(
      scoreQueryMatchParam4,
      scoreQueryMatchParam5 = false,
      scoreQueryMatchParam6 = this.match(scoreQueryMatchParam4),
    ) {
      if (scoreQueryMatchParam6 == null) return -2147483648;
      if (scoreQueryMatchParam6.length === 0) return 0;
      let scoreQueryMatchValue14 = scoreQueryMatchParam6[0],
        scoreQueryMatchValue15 = scoreQueryMatchValue14.startOffset === 0,
        scoreQueryMatchValue16 =
          scoreQueryMatchValue15 && scoreQueryMatchParam5,
        _scoreQueryMatch = 0,
        scoreQueryMatchValue17 = -1,
        scoreQueryMatchValue18 = 0,
        scoreQueryMatchValue19 = 0,
        scoreQueryMatchValue20 = false;
      for (let scoreQueryMatchValue32 of scoreQueryMatchParam6)
        for (
          let scoreQueryMatchValue39 = scoreQueryMatchValue32.startOffset;
          scoreQueryMatchValue39 < scoreQueryMatchValue32.endOffset;
          scoreQueryMatchValue39 += 1
        ) {
          let scoreQueryMatchValue42 =
              scoreQueryMatchValue39 === scoreQueryMatchValue32.startOffset &&
              scoreQueryMatchValue32 !== scoreQueryMatchValue14,
            scoreQueryMatchValue43 = false;
          for (; scoreQueryMatchValue19 <= scoreQueryMatchValue39; ) {
            scoreQueryMatchValue19 === scoreQueryMatchValue39
              ? (scoreQueryMatchValue43 = true)
              : scoreQueryMatchValue42 && (scoreQueryMatchValue18 += 1);
            scoreQueryMatchValue19 = scoreQueryMatchHelper8(
              scoreQueryMatchParam4,
              scoreQueryMatchValue19,
            );
          }
          let scoreQueryMatchValue44 =
            scoreQueryMatchParam4[scoreQueryMatchValue39];
          if (
            ((scoreQueryMatchValue17 = scoreQueryMatchHelper11(
              this.myPattern,
              scoreQueryMatchValue44,
              scoreQueryMatchValue17 + 1,
              this.myPattern.length,
              true,
            )),
            scoreQueryMatchValue17 < 0)
          )
            break;
          scoreQueryMatchValue43 &&
            (scoreQueryMatchValue20 =
              scoreQueryMatchValue44 ===
                this.myPattern[scoreQueryMatchValue17] &&
              this.isUpperCase[scoreQueryMatchValue17]);
          _scoreQueryMatch += this.evaluateCaseMatching(
            scoreQueryMatchValue16,
            scoreQueryMatchValue17,
            scoreQueryMatchValue20,
            scoreQueryMatchValue39,
            scoreQueryMatchValue42,
            scoreQueryMatchValue43,
            scoreQueryMatchValue44,
          );
        }
      let scoreQueryMatchValue21 = scoreQueryMatchValue14.startOffset,
        scoreQueryMatchValue22 =
          scoreQueryMatchHelper13(
            scoreQueryMatchParam4,
            this.hardSeparators,
            0,
            scoreQueryMatchValue21,
          ) >= 0,
        scoreQueryMatchValue23 =
          scoreQueryMatchValue21 === 0 ||
          (scoreQueryMatchHelper10(
            scoreQueryMatchParam4,
            scoreQueryMatchValue21,
          ) &&
            !scoreQueryMatchHelper10(
              scoreQueryMatchParam4,
              scoreQueryMatchValue21 - 1,
            )),
        scoreQueryMatchValue24 =
          scoreQueryMatchParam6[scoreQueryMatchParam6.length - 1].endOffset ===
          scoreQueryMatchParam4.length;
      return (
        (scoreQueryMatchValue23 ? 1e3 : 0) +
        _scoreQueryMatch -
        scoreQueryMatchParam6.length +
        -scoreQueryMatchValue18 * 10 +
        (scoreQueryMatchValue22 ? 0 : 2) +
        (scoreQueryMatchValue15 ? 1 : 0) +
        (scoreQueryMatchValue24 ? 1 : 0)
      );
    }
    match(scoreQueryMatchParam19) {
      if (scoreQueryMatchParam19.length < this.minNameLength) return null;
      if (this.myPattern.length > 100)
        return this.matchBySubstring(scoreQueryMatchParam19);
      let scoreQueryMatchValue30 = 0;
      for (
        let scoreQueryMatchValue61 = 0;
        scoreQueryMatchValue61 < scoreQueryMatchParam19.length &&
        scoreQueryMatchValue30 < this.meaningfulCharacters.length;
        scoreQueryMatchValue61 += 1
      ) {
        let scoreQueryMatchValue79 =
          scoreQueryMatchParam19[scoreQueryMatchValue61];
        (scoreQueryMatchValue79 ===
          this.meaningfulCharacters[scoreQueryMatchValue30] ||
          scoreQueryMatchValue79 ===
            this.meaningfulCharacters[scoreQueryMatchValue30 + 1]) &&
          (scoreQueryMatchValue30 += 2);
      }
      if (scoreQueryMatchValue30 < this.minNameLength * 2) return null;
      let scoreQueryMatchValue31 = this.matchWildcards(
        scoreQueryMatchParam19,
        0,
        0,
      );
      return scoreQueryMatchValue31 == null
        ? null
        : scoreQueryMatchValue31.reverse();
    }
    evaluateCaseMatching(
      scoreQueryMatchParam30,
      scoreQueryMatchParam31,
      scoreQueryMatchParam32,
      scoreQueryMatchParam33,
      scoreQueryMatchParam34,
      scoreQueryMatchParam35,
      scoreQueryMatchParam36,
    ) {
      return scoreQueryMatchParam34 &&
        scoreQueryMatchParam35 &&
        this.isLowerCase[scoreQueryMatchParam31]
        ? -10
        : scoreQueryMatchParam36 === this.myPattern[scoreQueryMatchParam31]
          ? this.isUpperCase[scoreQueryMatchParam31]
            ? 50
            : scoreQueryMatchParam33 === 0 && scoreQueryMatchParam30
              ? 150
              : scoreQueryMatchParam35
                ? 1
                : 0
          : scoreQueryMatchParam35 ||
              (this.isLowerCase[scoreQueryMatchParam31] &&
                scoreQueryMatchParam32)
            ? -1
            : 0;
    }
    matchBySubstring(scoreQueryMatchParam29) {
      let scoreQueryMatchValue53 = this.isPatternChar(0, "*"),
        scoreQueryMatchValue54 = scoreQueryMatchHelper17(this.myPattern);
      if (scoreQueryMatchParam29.length < scoreQueryMatchValue54.length)
        return null;
      if (scoreQueryMatchValue53) {
        let scoreQueryMatchValue85 = scoreQueryMatchHelper15(
          scoreQueryMatchParam29,
          scoreQueryMatchValue54,
          0,
          scoreQueryMatchParam29.length,
        );
        return scoreQueryMatchValue85 >= 0
          ? [
              {
                startOffset: scoreQueryMatchValue85,
                endOffset:
                  scoreQueryMatchValue85 + scoreQueryMatchValue54.length,
              },
            ]
          : null;
      }
      return scoreQueryMatchHelper16(
        scoreQueryMatchParam29,
        0,
        scoreQueryMatchValue54.length,
        scoreQueryMatchValue54,
      )
        ? [
            {
              startOffset: 0,
              endOffset: scoreQueryMatchValue54.length,
            },
          ]
        : null;
    }
    matchWildcards(
      scoreQueryMatchParam7,
      scoreQueryMatchParam8,
      scoreQueryMatchParam9,
    ) {
      let scoreQueryMatchValue25 = scoreQueryMatchParam8;
      if (scoreQueryMatchParam9 < 0) return null;
      if (!this.isWildcard(scoreQueryMatchValue25))
        return scoreQueryMatchValue25 === this.myPattern.length
          ? []
          : this.matchFragment(
              scoreQueryMatchParam7,
              scoreQueryMatchValue25,
              scoreQueryMatchParam9,
            );
      do scoreQueryMatchValue25 += 1;
      while (this.isWildcard(scoreQueryMatchValue25));
      if (scoreQueryMatchValue25 === this.myPattern.length) {
        if (
          this.isTrailingSpacePattern() &&
          scoreQueryMatchParam9 !== scoreQueryMatchParam7.length &&
          (scoreQueryMatchValue25 < 2 ||
            !this.isUpperCaseOrDigit(scoreQueryMatchValue25 - 2))
        ) {
          let scoreQueryMatchValue87 = scoreQueryMatchParam7.indexOf(
            " ",
            scoreQueryMatchParam9,
          );
          return scoreQueryMatchValue87 >= 0
            ? [
                {
                  startOffset: scoreQueryMatchValue87,
                  endOffset: scoreQueryMatchValue87 + 1,
                },
              ]
            : null;
        }
        return [];
      }
      return this.matchSkippingWords(
        scoreQueryMatchParam7,
        scoreQueryMatchValue25,
        this.findNextPatternCharOccurrence(
          scoreQueryMatchParam7,
          scoreQueryMatchParam9,
          scoreQueryMatchValue25,
        ),
        true,
      );
    }
    isTrailingSpacePattern() {
      return this.isPatternChar(this.myPattern.length - 1, " ");
    }
    isUpperCaseOrDigit(scoreQueryMatchParam115) {
      return (
        this.isUpperCase[scoreQueryMatchParam115] ||
        scoreQueryMatchHelper22(this.myPattern[scoreQueryMatchParam115])
      );
    }
    matchSkippingWords(
      scoreQueryMatchParam15,
      scoreQueryMatchParam16,
      scoreQueryMatchParam17,
      scoreQueryMatchParam18,
    ) {
      let scoreQueryMatchValue27 = scoreQueryMatchParam17,
        scoreQueryMatchValue28 = 0;
      for (; scoreQueryMatchValue27 >= 0; ) {
        let scoreQueryMatchValue40 = this.seemsLikeFragmentStart(
          scoreQueryMatchParam15,
          scoreQueryMatchParam16,
          scoreQueryMatchValue27,
        )
          ? this.maxMatchingFragment(
              scoreQueryMatchParam15,
              scoreQueryMatchParam16,
              scoreQueryMatchValue27,
            )
          : 0;
        if (
          scoreQueryMatchValue40 > scoreQueryMatchValue28 ||
          (scoreQueryMatchValue27 + scoreQueryMatchValue40 ===
            scoreQueryMatchParam15.length &&
            this.isTrailingSpacePattern())
        ) {
          this.isMiddleMatch(
            scoreQueryMatchParam15,
            scoreQueryMatchParam16,
            scoreQueryMatchValue27,
          ) || (scoreQueryMatchValue28 = scoreQueryMatchValue40);
          let scoreQueryMatchValue78 = this.matchInsideFragment(
            scoreQueryMatchParam15,
            scoreQueryMatchParam16,
            scoreQueryMatchValue27,
            scoreQueryMatchValue40,
          );
          if (scoreQueryMatchValue78 != null) return scoreQueryMatchValue78;
        }
        let scoreQueryMatchValue41 = this.findNextPatternCharOccurrence(
          scoreQueryMatchParam15,
          scoreQueryMatchValue27 + 1,
          scoreQueryMatchParam16,
        );
        scoreQueryMatchValue27 = scoreQueryMatchParam18
          ? scoreQueryMatchValue41
          : this.checkForSpecialChars(
              scoreQueryMatchParam15,
              scoreQueryMatchValue27 + 1,
              scoreQueryMatchValue41,
              scoreQueryMatchParam16,
            );
      }
      return null;
    }
    findNextPatternCharOccurrence(
      scoreQueryMatchParam66,
      scoreQueryMatchParam67,
      scoreQueryMatchParam68,
    ) {
      return !this.isPatternChar(scoreQueryMatchParam68 - 1, "*") &&
        !this.isWordSeparator[scoreQueryMatchParam68]
        ? this.indexOfWordStart(
            scoreQueryMatchParam66,
            scoreQueryMatchParam68,
            scoreQueryMatchParam67,
          )
        : this.indexOfIgnoreCase(
            scoreQueryMatchParam66,
            scoreQueryMatchParam67,
            scoreQueryMatchParam68,
          );
    }
    checkForSpecialChars(
      scoreQueryMatchParam41,
      scoreQueryMatchParam42,
      scoreQueryMatchParam43,
      scoreQueryMatchParam44,
    ) {
      return scoreQueryMatchParam43 < 0 ||
        (!this.hasSeparators &&
          !this.mixedCase &&
          scoreQueryMatchHelper13(
            scoreQueryMatchParam41,
            this.hardSeparators,
            scoreQueryMatchParam42,
            scoreQueryMatchParam43,
          ) !== -1) ||
        (this.hasDots &&
          !this.isPatternChar(scoreQueryMatchParam44 - 1, ".") &&
          scoreQueryMatchHelper14(
            scoreQueryMatchParam41,
            ".",
            scoreQueryMatchParam42,
            scoreQueryMatchParam43,
          ) !== -1)
        ? -1
        : scoreQueryMatchParam43;
    }
    seemsLikeFragmentStart(
      scoreQueryMatchParam71,
      scoreQueryMatchParam72,
      scoreQueryMatchParam73,
    ) {
      return !this.isUpperCase[scoreQueryMatchParam72] ||
        scoreQueryMatchHelper20(
          scoreQueryMatchParam71[scoreQueryMatchParam73],
        ) ||
        scoreQueryMatchHelper10(scoreQueryMatchParam71, scoreQueryMatchParam73)
        ? true
        : !this.mixedCase && this.matchingMode !== "MATCH_CASE";
    }
    charEquals(
      scoreQueryMatchParam80,
      scoreQueryMatchParam81,
      scoreQueryMatchParam82,
      scoreQueryMatchParam83,
    ) {
      return scoreQueryMatchParam80 === scoreQueryMatchParam82
        ? true
        : scoreQueryMatchParam83
          ? this.toLowerCase[scoreQueryMatchParam81] ===
              scoreQueryMatchParam82 ||
            this.toUpperCase[scoreQueryMatchParam81] === scoreQueryMatchParam82
          : false;
    }
    matchFragment(
      scoreQueryMatchParam88,
      scoreQueryMatchParam89,
      scoreQueryMatchParam90,
    ) {
      let scoreQueryMatchValue83 = this.maxMatchingFragment(
        scoreQueryMatchParam88,
        scoreQueryMatchParam89,
        scoreQueryMatchParam90,
      );
      return scoreQueryMatchValue83 === 0
        ? null
        : this.matchInsideFragment(
            scoreQueryMatchParam88,
            scoreQueryMatchParam89,
            scoreQueryMatchParam90,
            scoreQueryMatchValue83,
          );
    }
    maxMatchingFragment(
      scoreQueryMatchParam20,
      scoreQueryMatchParam21,
      scoreQueryMatchParam22,
    ) {
      if (
        !this.isFirstCharMatching(
          scoreQueryMatchParam20,
          scoreQueryMatchParam22,
          scoreQueryMatchParam21,
        )
      )
        return 0;
      let scoreQueryMatchValue45 = 1,
        scoreQueryMatchValue46 = this.matchingMode !== "MATCH_CASE";
      for (
        ;
        scoreQueryMatchParam22 + scoreQueryMatchValue45 <
          scoreQueryMatchParam20.length &&
        scoreQueryMatchParam21 + scoreQueryMatchValue45 < this.myPattern.length;
      ) {
        let scoreQueryMatchValue65 =
          scoreQueryMatchParam20[
            scoreQueryMatchParam22 + scoreQueryMatchValue45
          ];
        if (
          !this.charEquals(
            this.myPattern[scoreQueryMatchParam21 + scoreQueryMatchValue45],
            scoreQueryMatchParam21 + scoreQueryMatchValue45,
            scoreQueryMatchValue65,
            scoreQueryMatchValue46,
          )
        ) {
          if (
            this.isSkippingDigitBetweenPatternDigits(
              scoreQueryMatchParam21 + scoreQueryMatchValue45,
              scoreQueryMatchValue65,
            )
          )
            return 0;
          break;
        }
        scoreQueryMatchValue45 += 1;
      }
      return scoreQueryMatchValue45;
    }
    isSkippingDigitBetweenPatternDigits(
      scoreQueryMatchParam94,
      scoreQueryMatchParam95,
    ) {
      return (
        scoreQueryMatchHelper22(this.myPattern[scoreQueryMatchParam94]) &&
        scoreQueryMatchHelper22(this.myPattern[scoreQueryMatchParam94 - 1]) &&
        scoreQueryMatchHelper22(scoreQueryMatchParam95)
      );
    }
    matchInsideFragment(
      scoreQueryMatchParam60,
      scoreQueryMatchParam61,
      scoreQueryMatchParam62,
      scoreQueryMatchParam63,
    ) {
      let scoreQueryMatchValue71 = this.isMiddleMatch(
        scoreQueryMatchParam60,
        scoreQueryMatchParam61,
        scoreQueryMatchParam62,
      )
        ? 3
        : 1;
      return (
        this.improveCamelHumps(
          scoreQueryMatchParam60,
          scoreQueryMatchParam61,
          scoreQueryMatchParam62,
          scoreQueryMatchParam63,
          scoreQueryMatchValue71,
        ) ??
        this.findLongestMatchingPrefix(
          scoreQueryMatchParam60,
          scoreQueryMatchParam61,
          scoreQueryMatchParam62,
          scoreQueryMatchParam63,
          scoreQueryMatchValue71,
        )
      );
    }
    isMiddleMatch(
      scoreQueryMatchParam77,
      scoreQueryMatchParam78,
      scoreQueryMatchParam79,
    ) {
      return !this.isPatternChar(scoreQueryMatchParam78 - 1, "*") ||
        this.isWildcard(scoreQueryMatchParam78 + 1) ||
        !scoreQueryMatchHelper23(scoreQueryMatchParam77[scoreQueryMatchParam79])
        ? false
        : !scoreQueryMatchHelper10(
            scoreQueryMatchParam77,
            scoreQueryMatchParam79,
          );
    }
    findLongestMatchingPrefix(
      scoreQueryMatchParam10,
      scoreQueryMatchParam11,
      scoreQueryMatchParam12,
      scoreQueryMatchParam13,
      scoreQueryMatchParam14,
    ) {
      if (
        scoreQueryMatchParam11 + scoreQueryMatchParam13 >=
        this.myPattern.length
      )
        return [
          {
            startOffset: scoreQueryMatchParam12,
            endOffset: scoreQueryMatchParam12 + scoreQueryMatchParam13,
          },
        ];
      let scoreQueryMatchValue26 = scoreQueryMatchParam13;
      for (
        ;
        scoreQueryMatchValue26 >= scoreQueryMatchParam14 ||
        (scoreQueryMatchValue26 > 0 &&
          this.isWildcard(scoreQueryMatchParam11 + scoreQueryMatchValue26));
      ) {
        let scoreQueryMatchValue52 = null;
        if (this.isWildcard(scoreQueryMatchParam11 + scoreQueryMatchValue26))
          scoreQueryMatchValue52 = this.matchWildcards(
            scoreQueryMatchParam10,
            scoreQueryMatchParam11 + scoreQueryMatchValue26,
            scoreQueryMatchParam12 + scoreQueryMatchValue26,
          );
        else {
          let scoreQueryMatchValue66 = this.findNextPatternCharOccurrence(
            scoreQueryMatchParam10,
            scoreQueryMatchParam12 + scoreQueryMatchValue26 + 1,
            scoreQueryMatchParam11 + scoreQueryMatchValue26,
          );
          scoreQueryMatchValue66 = this.checkForSpecialChars(
            scoreQueryMatchParam10,
            scoreQueryMatchParam12 + scoreQueryMatchValue26,
            scoreQueryMatchValue66,
            scoreQueryMatchParam11 + scoreQueryMatchValue26,
          );
          scoreQueryMatchValue66 >= 0 &&
            (scoreQueryMatchValue52 = this.matchSkippingWords(
              scoreQueryMatchParam10,
              scoreQueryMatchParam11 + scoreQueryMatchValue26,
              scoreQueryMatchValue66,
              false,
            ));
        }
        if (scoreQueryMatchValue52 != null)
          return scoreQueryMatchHelper18(
            scoreQueryMatchValue52,
            scoreQueryMatchParam12,
            scoreQueryMatchValue26,
          );
        --scoreQueryMatchValue26;
      }
      return null;
    }
    improveCamelHumps(
      scoreQueryMatchParam48,
      scoreQueryMatchParam49,
      scoreQueryMatchParam50,
      scoreQueryMatchParam51,
      scoreQueryMatchParam52,
    ) {
      for (
        let scoreQueryMatchValue62 = scoreQueryMatchParam52;
        scoreQueryMatchValue62 < scoreQueryMatchParam51;
        scoreQueryMatchValue62 += 1
      )
        if (
          this.isUppercasePatternVsLowercaseNameChar(
            scoreQueryMatchParam48,
            scoreQueryMatchParam49 + scoreQueryMatchValue62,
            scoreQueryMatchParam50 + scoreQueryMatchValue62,
          )
        ) {
          let scoreQueryMatchValue86 = this.findUppercaseMatchFurther(
            scoreQueryMatchParam48,
            scoreQueryMatchParam49 + scoreQueryMatchValue62,
            scoreQueryMatchParam50 + scoreQueryMatchValue62,
          );
          if (scoreQueryMatchValue86 != null)
            return scoreQueryMatchHelper18(
              scoreQueryMatchValue86,
              scoreQueryMatchParam50,
              scoreQueryMatchValue62,
            );
        }
      return null;
    }
    isUppercasePatternVsLowercaseNameChar(
      scoreQueryMatchParam100,
      scoreQueryMatchParam101,
      scoreQueryMatchParam102,
    ) {
      return (
        this.isUpperCase[scoreQueryMatchParam101] &&
        this.myPattern[scoreQueryMatchParam101] !==
          scoreQueryMatchParam100[scoreQueryMatchParam102]
      );
    }
    findUppercaseMatchFurther(
      scoreQueryMatchParam91,
      scoreQueryMatchParam92,
      scoreQueryMatchParam93,
    ) {
      let scoreQueryMatchValue84 = this.indexOfWordStart(
        scoreQueryMatchParam91,
        scoreQueryMatchParam92,
        scoreQueryMatchParam93,
      );
      return this.matchWildcards(
        scoreQueryMatchParam91,
        scoreQueryMatchParam92,
        scoreQueryMatchValue84,
      );
    }
    isFirstCharMatching(
      scoreQueryMatchParam26,
      scoreQueryMatchParam27,
      scoreQueryMatchParam28,
    ) {
      if (scoreQueryMatchParam27 >= scoreQueryMatchParam26.length) return false;
      let scoreQueryMatchValue50 = this.matchingMode !== "MATCH_CASE",
        scoreQueryMatchValue51 = this.myPattern[scoreQueryMatchParam28];
      return this.charEquals(
        scoreQueryMatchValue51,
        scoreQueryMatchParam28,
        scoreQueryMatchParam26[scoreQueryMatchParam27],
        scoreQueryMatchValue50,
      )
        ? this.matchingMode === "FIRST_LETTER" &&
          (scoreQueryMatchParam28 === 0 ||
            (scoreQueryMatchParam28 === 1 && this.isWildcard(0))) &&
          this.hasCase(scoreQueryMatchParam28)
          ? this.isUpperCase[scoreQueryMatchParam28] ===
            scoreQueryMatchHelper20(scoreQueryMatchParam26[0])
          : true
        : false;
    }
    hasCase(scoreQueryMatchParam123) {
      return (
        this.isUpperCase[scoreQueryMatchParam123] ||
        this.isLowerCase[scoreQueryMatchParam123]
      );
    }
    isWildcard(scoreQueryMatchParam114) {
      return (
        scoreQueryMatchParam114 >= 0 &&
        scoreQueryMatchParam114 < this.myPattern.length &&
        scoreQueryMatchHelper12(this.myPattern[scoreQueryMatchParam114])
      );
    }
    isPatternChar(scoreQueryMatchParam103, scoreQueryMatchParam104) {
      return scoreQueryMatchParam103 < 0 ||
        scoreQueryMatchParam103 >= this.myPattern.length
        ? false
        : this.myPattern[scoreQueryMatchParam103] === scoreQueryMatchParam104;
    }
    indexOfWordStart(
      scoreQueryMatchParam23,
      scoreQueryMatchParam24,
      scoreQueryMatchParam25,
    ) {
      let scoreQueryMatchValue47 = this.myPattern[scoreQueryMatchParam24];
      if (
        scoreQueryMatchParam25 >= scoreQueryMatchParam23.length ||
        (this.mixedCase &&
          this.isLowerCase[scoreQueryMatchParam24] &&
          !(
            scoreQueryMatchParam24 > 0 &&
            this.isWordSeparator[scoreQueryMatchParam24 - 1]
          ))
      )
        return -1;
      let scoreQueryMatchValue48 = scoreQueryMatchParam25,
        scoreQueryMatchValue49 = !scoreQueryMatchHelper23(
          scoreQueryMatchValue47,
        );
      for (;;) {
        if (
          ((scoreQueryMatchValue48 = this.indexOfIgnoreCase(
            scoreQueryMatchParam23,
            scoreQueryMatchValue48,
            scoreQueryMatchParam24,
          )),
          scoreQueryMatchValue48 < 0)
        )
          return -1;
        if (
          scoreQueryMatchValue49 ||
          scoreQueryMatchHelper10(
            scoreQueryMatchParam23,
            scoreQueryMatchValue48,
          )
        )
          return scoreQueryMatchValue48;
        scoreQueryMatchValue48 += 1;
      }
    }
    indexOfIgnoreCase(
      scoreQueryMatchParam37,
      scoreQueryMatchParam38,
      scoreQueryMatchParam39,
    ) {
      let scoreQueryMatchValue55 = this.myPattern[scoreQueryMatchParam39];
      if (scoreQueryMatchHelper19(scoreQueryMatchValue55)) {
        let scoreQueryMatchValue63 = this.toUpperCase[scoreQueryMatchParam39],
          scoreQueryMatchValue64 = this.toLowerCase[scoreQueryMatchParam39];
        for (
          let scoreQueryMatchValue89 = scoreQueryMatchParam38;
          scoreQueryMatchValue89 < scoreQueryMatchParam37.length;
          scoreQueryMatchValue89 += 1
        ) {
          let scoreQueryMatchValue96 =
            scoreQueryMatchParam37[scoreQueryMatchValue89];
          if (
            scoreQueryMatchValue96 === scoreQueryMatchValue63 ||
            scoreQueryMatchValue96 === scoreQueryMatchValue64
          )
            return scoreQueryMatchValue89;
        }
        return -1;
      }
      return scoreQueryMatchHelper14(
        scoreQueryMatchParam37,
        scoreQueryMatchValue55,
        scoreQueryMatchParam38,
        scoreQueryMatchParam37.length,
      );
    }
  };
export function scoreQueryMatch(
  scoreQueryMatchParam58,
  scoreQueryMatchParam59,
) {
  let scoreQueryMatchValue67 = scoreQueryMatchParam59.trim();
  if (scoreQueryMatchValue67.length === 0) return 0;
  let scoreQueryMatchValue68 = scoreQueryMatchHelper1(scoreQueryMatchValue67),
    scoreQueryMatchValue69 = scoreQueryMatchHelper5(scoreQueryMatchValue67)
      ? scoreQueryMatchHelper4(scoreQueryMatchParam58)
      : scoreQueryMatchParam58,
    scoreQueryMatchValue70 = scoreQueryMatchValue68.matchingDegree(
      scoreQueryMatchValue69,
    );
  if (scoreQueryMatchValue70 === -2147483648) return 0;
  let _scoreQueryMatch =
    scoreQueryMatchValue70 * 10 - scoreQueryMatchParam58.length;
  return _scoreQueryMatch <= 0 ? 1 : _scoreQueryMatch;
}
function scoreQueryMatchHelper1(scoreQueryMatchParam69) {
  let scoreQueryMatchValue74 = scoreQueryMatchHelper5(scoreQueryMatchParam69),
    scoreQueryMatchValue75 = scoreQueryMatchValue74
      ? scoreQueryMatchHelper2(scoreQueryMatchParam69)
      : `*${scoreQueryMatchParam69}`,
    scoreQueryMatchValue76 = scoreQueryMatchHelper3(scoreQueryMatchParam69);
  return new scoreQueryMatchValue6(
    new scoreQueryMatchValue7(
      scoreQueryMatchValue75,
      "IGNORE_CASE",
      scoreQueryMatchValue4.join(""),
    ),
    scoreQueryMatchValue74 && scoreQueryMatchParam69 !== scoreQueryMatchValue76
      ? new scoreQueryMatchValue7(
          scoreQueryMatchValue76,
          "IGNORE_CASE",
          scoreQueryMatchValue4.join(""),
        )
      : null,
  );
}
function scoreQueryMatchHelper2(scoreQueryMatchParam109) {
  let scoreQueryMatchValue91 = `*${scoreQueryMatchParam109}`;
  for (let scoreQueryMatchValue101 of scoreQueryMatchValue4)
    scoreQueryMatchValue91 = scoreQueryMatchValue91
      .split(scoreQueryMatchValue101)
      .join(`*${"\0"}*`);
  return scoreQueryMatchValue91;
}
function scoreQueryMatchHelper3(scoreQueryMatchParam74) {
  let scoreQueryMatchValue77 = -1;
  for (let scoreQueryMatchValue90 of scoreQueryMatchValue4) {
    let scoreQueryMatchValue93 = scoreQueryMatchParam74.lastIndexOf(
      scoreQueryMatchValue90,
    );
    scoreQueryMatchValue93 >= 0 &&
      scoreQueryMatchValue93 < scoreQueryMatchParam74.length - 1 &&
      (scoreQueryMatchValue77 = Math.max(
        scoreQueryMatchValue77,
        scoreQueryMatchValue93,
      ));
  }
  return scoreQueryMatchParam74.slice(scoreQueryMatchValue77 + 1);
}
function scoreQueryMatchHelper4(scoreQueryMatchParam120) {
  let scoreQueryMatchValue94 = scoreQueryMatchParam120;
  for (let scoreQueryMatchValue103 of scoreQueryMatchValue4)
    scoreQueryMatchValue94 = scoreQueryMatchValue94
      .split(scoreQueryMatchValue103)
      .join("\0");
  return scoreQueryMatchValue94;
}
function scoreQueryMatchHelper5(scoreQueryMatchParam122) {
  for (let scoreQueryMatchValue102 of scoreQueryMatchValue4)
    if (scoreQueryMatchParam122.includes(scoreQueryMatchValue102)) return true;
  return false;
}
function scoreQueryMatchHelper6(
  scoreQueryMatchParam116,
  scoreQueryMatchParam117,
) {
  return scoreQueryMatchParam117.length === 0
    ? scoreQueryMatchParam116
    : scoreQueryMatchParam117[0].startOffset === 0
      ? scoreQueryMatchParam116 + 1e4
      : scoreQueryMatchParam116;
}
function scoreQueryMatchHelper7(scoreQueryMatchParam70) {
  return (
    scoreQueryMatchParam70.trim().length === 0 ||
    scoreQueryMatchParam70 === "_" ||
    scoreQueryMatchParam70 === "-" ||
    scoreQueryMatchParam70 === ":" ||
    scoreQueryMatchParam70 === "+" ||
    scoreQueryMatchParam70 === "." ||
    scoreQueryMatchParam70 === "/" ||
    scoreQueryMatchParam70 === "\\"
  );
}
function scoreQueryMatchHelper8(
  scoreQueryMatchParam126,
  scoreQueryMatchParam127,
) {
  return scoreQueryMatchParam127 < scoreQueryMatchParam126.length &&
    scoreQueryMatchHelper22(scoreQueryMatchParam126[scoreQueryMatchParam127])
    ? scoreQueryMatchParam127 + 1
    : scoreQueryMatchHelper9(scoreQueryMatchParam126, scoreQueryMatchParam127);
}
function scoreQueryMatchHelper9(
  scoreQueryMatchParam75,
  scoreQueryMatchParam76,
) {
  for (
    let scoreQueryMatchValue88 = scoreQueryMatchParam76 + 1;
    scoreQueryMatchValue88 <= scoreQueryMatchParam75.length;
    scoreQueryMatchValue88 += 1
  ) {
    if (scoreQueryMatchValue88 >= scoreQueryMatchParam75.length)
      return scoreQueryMatchParam75.length + 1;
    if (scoreQueryMatchHelper10(scoreQueryMatchParam75, scoreQueryMatchValue88))
      return scoreQueryMatchValue88;
  }
  return scoreQueryMatchParam75.length + 1;
}
function scoreQueryMatchHelper10(
  scoreQueryMatchParam64,
  scoreQueryMatchParam65,
) {
  if (
    scoreQueryMatchParam65 < 0 ||
    scoreQueryMatchParam65 >= scoreQueryMatchParam64.length
  )
    return false;
  let scoreQueryMatchValue72 = scoreQueryMatchParam64[scoreQueryMatchParam65];
  if (!scoreQueryMatchHelper23(scoreQueryMatchValue72)) return false;
  if (scoreQueryMatchParam65 === 0) return true;
  let scoreQueryMatchValue73 =
    scoreQueryMatchParam64[scoreQueryMatchParam65 - 1];
  return !!(
    !scoreQueryMatchHelper23(scoreQueryMatchValue73) ||
    (scoreQueryMatchHelper20(scoreQueryMatchValue72) &&
      scoreQueryMatchHelper21(scoreQueryMatchValue73)) ||
    (scoreQueryMatchHelper22(scoreQueryMatchValue72) &&
      !scoreQueryMatchHelper22(scoreQueryMatchValue73))
  );
}
function scoreQueryMatchHelper11(
  scoreQueryMatchParam53,
  scoreQueryMatchParam54,
  scoreQueryMatchParam55,
  scoreQueryMatchParam56,
  scoreQueryMatchParam57,
) {
  if (!scoreQueryMatchParam57) {
    for (
      let scoreQueryMatchValue99 = scoreQueryMatchParam55;
      scoreQueryMatchValue99 < scoreQueryMatchParam56;
      scoreQueryMatchValue99 += 1
    )
      if (
        scoreQueryMatchParam53[scoreQueryMatchValue99] ===
        scoreQueryMatchParam54
      )
        return scoreQueryMatchValue99;
    return -1;
  }
  let scoreQueryMatchValue59 = scoreQueryMatchParam54.toLowerCase(),
    scoreQueryMatchValue60 = scoreQueryMatchParam54.toUpperCase();
  for (
    let scoreQueryMatchValue92 = scoreQueryMatchParam55;
    scoreQueryMatchValue92 < scoreQueryMatchParam56;
    scoreQueryMatchValue92 += 1
  ) {
    let scoreQueryMatchValue98 = scoreQueryMatchParam53[scoreQueryMatchValue92];
    if (
      scoreQueryMatchValue98 === scoreQueryMatchValue59 ||
      scoreQueryMatchValue98 === scoreQueryMatchValue60
    )
      return scoreQueryMatchValue92;
  }
  return -1;
}
function scoreQueryMatchHelper12(scoreQueryMatchParam129) {
  return scoreQueryMatchParam129 === " " || scoreQueryMatchParam129 === "*";
}
function scoreQueryMatchHelper13(
  scoreQueryMatchParam105,
  scoreQueryMatchParam106,
  scoreQueryMatchParam107,
  scoreQueryMatchParam108,
) {
  for (
    let scoreQueryMatchValue97 = scoreQueryMatchParam107;
    scoreQueryMatchValue97 < scoreQueryMatchParam108;
    scoreQueryMatchValue97 += 1
  )
    if (
      scoreQueryMatchParam106.includes(
        scoreQueryMatchParam105[scoreQueryMatchValue97],
      )
    )
      return scoreQueryMatchValue97;
  return -1;
}
function scoreQueryMatchHelper14(
  scoreQueryMatchParam110,
  scoreQueryMatchParam111,
  scoreQueryMatchParam112,
  scoreQueryMatchParam113,
) {
  for (
    let scoreQueryMatchValue100 = scoreQueryMatchParam112;
    scoreQueryMatchValue100 < scoreQueryMatchParam113;
    scoreQueryMatchValue100 += 1
  )
    if (
      scoreQueryMatchParam110[scoreQueryMatchValue100] ===
      scoreQueryMatchParam111
    )
      return scoreQueryMatchValue100;
  return -1;
}
function scoreQueryMatchHelper15(
  scoreQueryMatchParam84,
  scoreQueryMatchParam85,
  scoreQueryMatchParam86,
  scoreQueryMatchParam87,
) {
  let scoreQueryMatchValue80 = scoreQueryMatchParam84.toLowerCase(),
    scoreQueryMatchValue81 = scoreQueryMatchParam85.toLowerCase(),
    scoreQueryMatchValue82 = scoreQueryMatchValue80.indexOf(
      scoreQueryMatchValue81,
      scoreQueryMatchParam86,
    );
  return scoreQueryMatchValue82 < 0 ||
    scoreQueryMatchValue82 + scoreQueryMatchParam85.length >
      scoreQueryMatchParam87
    ? -1
    : scoreQueryMatchValue82;
}
function scoreQueryMatchHelper16(
  scoreQueryMatchParam96,
  scoreQueryMatchParam97,
  scoreQueryMatchParam98,
  scoreQueryMatchParam99,
) {
  return scoreQueryMatchParam97 + scoreQueryMatchParam98 >
    scoreQueryMatchParam96.length
    ? false
    : scoreQueryMatchParam96
        .slice(
          scoreQueryMatchParam97,
          scoreQueryMatchParam97 + scoreQueryMatchParam98,
        )
        .toLowerCase() === scoreQueryMatchParam99.toLowerCase();
}
function scoreQueryMatchHelper17(scoreQueryMatchParam121) {
  let scoreQueryMatchValue95 = "";
  for (let scoreQueryMatchValue104 of scoreQueryMatchParam121)
    scoreQueryMatchValue104 !== "*" &&
      (scoreQueryMatchValue95 += scoreQueryMatchValue104);
  return scoreQueryMatchValue95;
}
function scoreQueryMatchHelper18(
  scoreQueryMatchParam45,
  scoreQueryMatchParam46,
  scoreQueryMatchParam47,
) {
  if (scoreQueryMatchParam45.length === 0)
    return [
      {
        startOffset: scoreQueryMatchParam46,
        endOffset: scoreQueryMatchParam46 + scoreQueryMatchParam47,
      },
    ];
  let scoreQueryMatchValue58 =
    scoreQueryMatchParam45[scoreQueryMatchParam45.length - 1];
  return (
    scoreQueryMatchValue58.startOffset ===
    scoreQueryMatchParam46 + scoreQueryMatchParam47
      ? (scoreQueryMatchParam45[scoreQueryMatchParam45.length - 1] = {
          startOffset: scoreQueryMatchParam46,
          endOffset: scoreQueryMatchValue58.endOffset,
        })
      : scoreQueryMatchParam45.push({
          startOffset: scoreQueryMatchParam46,
          endOffset: scoreQueryMatchParam46 + scoreQueryMatchParam47,
        }),
    scoreQueryMatchParam45
  );
}
function scoreQueryMatchHelper19(scoreQueryMatchParam128) {
  return (
    scoreQueryMatchParam128.length === 1 &&
    scoreQueryMatchParam128.charCodeAt(0) <= 127
  );
}
function scoreQueryMatchHelper20(scoreQueryMatchParam124) {
  return (
    scoreQueryMatchParam124.toUpperCase() === scoreQueryMatchParam124 &&
    scoreQueryMatchParam124.toLowerCase() !== scoreQueryMatchParam124
  );
}
function scoreQueryMatchHelper21(scoreQueryMatchParam125) {
  return (
    scoreQueryMatchParam125.toLowerCase() === scoreQueryMatchParam125 &&
    scoreQueryMatchParam125.toUpperCase() !== scoreQueryMatchParam125
  );
}
function scoreQueryMatchHelper22(scoreQueryMatchParam130) {
  return scoreQueryMatchParam130 >= "0" && scoreQueryMatchParam130 <= "9";
}
function scoreQueryMatchHelper23(scoreQueryMatchParam131) {
  return /[a-z0-9]/i.test(scoreQueryMatchParam131);
}

// Aliases used by consumer checkpoints
export declare const scoreQueryMatch: any;
