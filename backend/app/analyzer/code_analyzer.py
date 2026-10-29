import ast
import json
import subprocess
import tempfile
from pathlib import Path

from radon.complexity import cc_visit


def analyze_code(source_code: str) -> dict:
    """
    Analyze Python source code using Ruff, Pylint, and Radon.

    Returns code-quality findings and complexity metrics.
    """

    if not source_code or not source_code.strip():
        raise ValueError("Source code cannot be empty.")

    # Validate Python syntax before running analysis tools.
    try:
        ast.parse(source_code)
    except SyntaxError as error:
        return {
            "success": False,
            "message": "The submitted code contains a syntax error.",
            "findings": [
                {
                    "tool": "Python",
                    "type": "syntax_error",
                    "severity": "error",
                    "message": error.msg,
                    "line": error.lineno,
                    "column": error.offset,
                }
            ],
            "metrics": {
                "lines_of_code": len(source_code.splitlines()),
                "function_count": 0,
                "average_complexity": 0,
            },
        }

    findings = []
    metrics = {
        "lines_of_code": len(source_code.splitlines()),
        "function_count": 0,
        "average_complexity": 0,
    }

    # Use a temporary directory so submitted code is not saved
    # inside the project's source folders.
    with tempfile.TemporaryDirectory() as temp_dir:
        file_path = Path(temp_dir) / "submitted_code.py"
        file_path.write_text(source_code, encoding="utf-8")

        # Run Ruff.
        try:
            result = subprocess.run(
                [
                    "ruff",
                    "check",
                    "--output-format",
                    "json",
                    str(file_path),
                ],
                capture_output=True,
                text=True,
                timeout=15,
                check=False,
            )

            if result.stdout.strip():
                try:
                    ruff_findings = json.loads(result.stdout)

                    for issue in ruff_findings:
                        findings.append(
                            {
                                "tool": "Ruff",
                                "rule": issue.get("code"),
                                "type": "lint",
                                "severity": "warning",
                                "message": issue.get("message"),
                                "line": issue.get("location", {}).get("row"),
                                "column": issue.get("location", {}).get("column"),
                            }
                        )
                except json.JSONDecodeError:
                    findings.append(
                        {
                            "tool": "Ruff",
                            "type": "tool_error",
                            "severity": "warning",
                            "message": "Ruff returned an unreadable report.",
                            "line": None,
                            "column": None,
                        }
                    )

        except (OSError, subprocess.TimeoutExpired) as error:
            findings.append(
                {
                    "tool": "Ruff",
                    "type": "tool_error",
                    "severity": "warning",
                    "message": f"Ruff could not complete analysis: {type(error).__name__}",
                    "line": None,
                    "column": None,
                }
            )

        # Run Pylint.
        try:
            result = subprocess.run(
                [
                    "pylint",
                    "--output-format=json",
                    "--score=n",
                    "--reports=n",
                    str(file_path),
                ],
                capture_output=True,
                text=True,
                timeout=20,
                check=False,
            )

            if result.stdout.strip():
                try:
                    pylint_findings = json.loads(result.stdout)

                    for issue in pylint_findings:
                        findings.append(
                            {
                                "tool": "Pylint",
                                "rule": issue.get("message-id"),
                                "type": issue.get("type"),
                                "severity": issue.get("type", "warning").lower(),
                                "message": issue.get("message"),
                                "line": issue.get("line"),
                                "column": issue.get("column"),
                            }
                        )
                except json.JSONDecodeError:
                    findings.append(
                        {
                            "tool": "Pylint",
                            "type": "tool_error",
                            "severity": "warning",
                            "message": "Pylint returned an unreadable report.",
                            "line": None,
                            "column": None,
                        }
                    )

        except (OSError, subprocess.TimeoutExpired) as error:
            findings.append(
                {
                    "tool": "Pylint",
                    "type": "tool_error",
                    "severity": "warning",
                    "message": f"Pylint could not complete analysis: {type(error).__name__}",
                    "line": None,
                    "column": None,
                }
            )

    # Calculate cyclomatic complexity using Radon.
    try:
        blocks = cc_visit(source_code)

        complexities = [block.complexity for block in blocks]

        metrics["function_count"] = len(
            [
                block
                for block in blocks
                if block.__class__.__name__ in ("Function", "AsyncFunction")
            ]
        )

        metrics["average_complexity"] = (
            round(sum(complexities) / len(complexities), 2)
            if complexities
            else 0
        )

        for block in blocks:
            if block.complexity > 10:
                findings.append(
                    {
                        "tool": "Radon",
                        "rule": "high-complexity",
                        "type": "complexity",
                        "severity": "warning",
                        "message": (
                            f"'{block.name}' has cyclomatic complexity "
                            f"{block.complexity}. Consider simplifying it."
                        ),
                        "line": block.lineno,
                        "column": None,
                    }
                )

    except Exception:
        findings.append(
            {
                "tool": "Radon",
                "type": "tool_error",
                "severity": "warning",
                "message": "Radon could not calculate code complexity.",
                "line": None,
                "column": None,
            }
        )

    return {
        "success": True,
        "message": "Code analysis completed successfully.",
        "findings": findings,
        "metrics": metrics,
        "summary": {
            "total_issues": len(findings),
            "ruff_issues": sum(
                1 for issue in findings if issue["tool"] == "Ruff"
            ),
            "pylint_issues": sum(
                1 for issue in findings if issue["tool"] == "Pylint"
            ),
            "radon_issues": sum(
                1 for issue in findings if issue["tool"] == "Radon"
            ),
        },
    }