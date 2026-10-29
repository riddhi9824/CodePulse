from app.analyzer.code_analyzer import analyze_code


def test_analyze_valid_code():
    code = """
def add(a, b):
    return a + b
"""

    result = analyze_code(code)

    assert result["success"] is True
    assert "findings" in result
    assert "metrics" in result
    assert "summary" in result


def test_analyze_syntax_error():
    code = """
def add(a, b)
    return a + b
"""

    result = analyze_code(code)

    assert result["success"] is False
    assert result["findings"][0]["type"] == "syntax_error"


def test_analyze_empty_code():
    try:
        analyze_code("")
        assert False, "Expected ValueError for empty code."
    except ValueError:
        pass