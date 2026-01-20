"""Extract MLE-Bench leaderboard from GitHub README.

This script fetches the MLE-Bench README from the official repository
and extracts the leaderboard table into a structured format.
"""

import re
import requests
from pathlib import Path

LEADERBOARD_FILE = Path(__file__).parent / "data/mle_bench_leaderboard.csv" 

def fetch_readme() -> str:
    """Fetch the MLE-Bench README from GitHub."""
    url = "https://raw.githubusercontent.com/openai/mle-bench/refs/heads/main/README.md"
    response = requests.get(url)
    response.raise_for_status()
    return response.text


def extract_leaderboard_table(readme_content: str) -> str:
    """Extract the leaderboard markdown table from README content."""
    # Find the leaderboard section - look for the table starting with | Agent |
    lines = readme_content.split('\n')
    table_lines = []
    in_table = False

    for line in lines:
        if '| Agent |' in line:
            in_table = True
        if in_table:
            table_lines.append(line)
            # Stop when we hit a non-table line (empty or text that's not part of table)
            if line.strip() and not line.strip().startswith('|') and len(table_lines) > 2:
                table_lines.pop()  # Remove the non-table line
                break

    return '\n'.join(table_lines)


def clean_markdown_links(text: str) -> str:
    """Remove markdown links and keep only the link text.

    Converts [text](url) to just text.

    Args:
        text: String that may contain markdown links

    Returns:
        String with markdown links removed, keeping only the link text
    """
    # Pattern for markdown links: [text](url)
    return re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)


def parse_error_value(value_str: str) -> tuple[float, float]:
    """Parse a value with error in format 'value ± error' into (value, error) tuple.

    Args:
        value_str: String in format like "43.56 ± 1.78"

    Returns:
        Tuple of (value, error) as floats, or (NaN, NaN) if parsing fails
    """
    value_str = value_str.strip()
    if not value_str or '±' not in value_str:
        return (float('nan'), float('nan'))

    try:
        parts = value_str.split('±')
        value = float(parts[0].strip())
        error = float(parts[1].strip())
        return (value, error)
    except (ValueError, IndexError):
        return (float('nan'), float('nan'))


def parse_markdown_table(table_str: str) -> pd.DataFrame:
    """Parse a markdown table into a pandas DataFrame with error separation.

    Columns with ± values (e.g., "43.56 ± 1.78") are split into two columns:
    - Original column becomes the value
    - New column with "_error" suffix contains the error
    """
    lines = table_str.strip().split('\n')

    # Extract header
    header_line = lines[0]
    headers = [h.strip() for h in header_line.split('|')[1:-1]]

    # Extract rows (skip separator line at index 1)
    rows = []
    for line in lines[2:]:
        if line.strip().startswith('|') and line.strip().endswith('|'):
            cells = [cell.strip() for cell in line.split('|')[1:-1]]
            rows.append(cells)

    df = pd.DataFrame(rows, columns=headers)

    # Clean markdown links from all cells
    df = df.map(lambda x: clean_markdown_links(str(x)) if isinstance(x, str) else x)

    # Parse error columns and expand them
    new_columns = {}
    columns_to_drop = []

    for col in df.columns:
        # Check if column contains ± values
        if '±' in df[col].iloc[0] if len(df) > 0 else False:
            columns_to_drop.append(col)
            values = []
            errors = []

            for val_str in df[col]:
                value, error = parse_error_value(val_str)
                values.append(value)
                errors.append(error)

            new_columns[col] = values
            new_columns[f"{col}_error"] = errors
        else:
            # For columns that might have errors, check each cell
            has_error = any('±' in str(cell) for cell in df[col])
            if has_error:
                columns_to_drop.append(col)
                values = []
                errors = []

                for val_str in df[col]:
                    value, error = parse_error_value(str(val_str))
                    values.append(value)
                    errors.append(error)

                new_columns[col] = values
                new_columns[f"{col}_error"] = errors
            else:
                new_columns[col] = df[col].tolist()

    # Reconstruct dataframe with expanded columns
    result_df = pd.DataFrame(new_columns)

    # Reorder columns to put error columns right after their value columns
    final_columns = []
    seen = set()
    for col in result_df.columns:
        if col.endswith('_error'):
            continue
        final_columns.append(col)
        error_col = f"{col}_error"
        if error_col in result_df.columns:
            final_columns.append(error_col)
            seen.add(error_col)

    # Add any remaining error columns that weren't matched
    for col in result_df.columns:
        if col not in seen and col.endswith('_error'):
            final_columns.append(col)

    return result_df[final_columns]


def save_leaderboard(df: pd.DataFrame, output_path: Path) -> None:
    """Save the leaderboard to a CSV file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Leaderboard saved to: {output_path}")


def main():
    """Main function to extract and save the leaderboard."""
    # Fetch README
    print("Fetching MLE-Bench README...")
    readme_content = fetch_readme()

    # Extract leaderboard table
    print("Extracting leaderboard table...")
    table_str = extract_leaderboard_table(readme_content)

    # Parse into DataFrame
    print("Parsing leaderboard data...")
    df = parse_markdown_table(table_str)

    # Display the dataframe
    print("\nLeaderboard Data:")
    print(df.to_string(index=False))
    print(f"\nTotal entries: {len(df)}")

    # Save to CSV
    save_leaderboard(df, LEADERBOARD_FILE)

    return df


if __name__ == "__main__":
    df = main()
