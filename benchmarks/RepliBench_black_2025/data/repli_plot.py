#!/usr/bin/env python3

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime
import numpy as np
from scipy.optimize import curve_fit

def logistic_function(x, L, k, x0, b):
    """Logistic function for fitting the trend line"""
    return L / (1 + np.exp(-k * (x - x0))) + b

def create_replibench_plot(csv_file, save_path=None):
    """
    Create a RepliBench-style plot from the extracted CSV data
    
    Args:
        csv_file: Path to the CSV file with extracted data
        save_path: Optional path to save the plot
    """
    
    # Read the data
    df = pd.read_csv(csv_file)
    df['error_low']=df['score']-df['confidence_interval_low']
    df['error_high']=df['confidence_interval_high'] - df['score']
    df['date'] = pd.to_datetime(df['date'])
    
    # Create figure with similar styling to the original
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Convert dates to numeric for fitting
    date_numeric = mdates.date2num(df['date'])
    
    # Plot the data points with error bars
    ax.errorbar(df['date'], df['score'], 
               yerr=[df['error_low'], df['error_high']], 
               fmt='o', 
               color='#1f77b4',  # Blue color
               markersize=8,
               capsize=4,
               capthick=1.5,
               elinewidth=1.5,
               label='Model Scores',
               zorder=5)
    
    # Add model labels next to points
    for i, row in df.iterrows():
        # Offset labels to avoid overlap
        offset_x = 20 if i < len(df) // 2 else -20
        offset_y = 10 if i % 2 == 0 else -15
        
        ax.annotate(row['model'], 
                   xy=(row['date'], row['score']),
                   xytext=(offset_x, offset_y), 
                   textcoords='offset points',
                   fontsize=10,
                   ha='left' if offset_x > 0 else 'right',
                   va='bottom' if offset_y > 0 else 'top',
                   bbox=dict(boxstyle='round,pad=0.3', 
                           facecolor='white', 
                           alpha=0.8,
                           edgecolor='none'),
                   zorder=6)
    
    # Fit a logistic function to the running maximum (similar to original)
    try:
        # Create running maximum
        running_max = np.maximum.accumulate(df['score'])
        
        # Fit logistic function
        popt, _ = curve_fit(logistic_function, date_numeric, running_max, 
                           p0=[0.7, 0.01, np.median(date_numeric), 0.1],
                           maxfev=5000)
        
        # Generate smooth curve for plotting
        date_range = pd.date_range(start=df['date'].min() - pd.Timedelta(days=30),
                                 end=df['date'].max() + pd.Timedelta(days=180),
                                 freq='D')
        date_range_numeric = mdates.date2num(date_range)
        fitted_curve = logistic_function(date_range_numeric, *popt)
        
        # Plot the fitted curve
        ax.plot(date_range, fitted_curve, 
               '--', color='purple', linewidth=2, alpha=0.8,
               label='Running Max Logistic Fit',
               zorder=3)
        
    except Exception as e:
        print(f"Could not fit logistic curve: {e}")
    
    # Styling to match the original
    ax.set_xlabel('Release Date', fontsize=12)
    ax.set_ylabel('Overall Score (Average of Domain Scores)', fontsize=12)
    ax.set_title('RepliBench: Evaluating the Autonomous Replication Capabilities\nof Language Model Agents', 
                fontsize=14, fontweight='bold', pad=20)
    
    # Set axis limits and formatting
    ax.set_ylim(0, 0.76)
    ax.grid(True, alpha=0.3, linestyle='-', linewidth=0.5)
    
    # Format x-axis
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
    ax.xaxis.set_minor_locator(mdates.MonthLocator())
    plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')
    
    # Format y-axis
    ax.set_yticks(np.arange(0, 0.8, 0.1))
    ax.yaxis.set_minor_locator(plt.MultipleLocator(0.05))
    
    # Add legend
    ax.legend(loc='upper left', frameon=True, fancybox=True, shadow=True)
    
    # Add some styling improvements
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_linewidth(0.5)
    ax.spines['bottom'].set_linewidth(0.5)
    
    # Tight layout
    plt.tight_layout()
    
    # Save if path provided
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        print(f"Plot saved to: {save_path}")
    
    return fig, ax

def create_simple_version(csv_file, save_path=None):
    """
    Create a simpler version without the logistic fit
    """
    
    # Read the data
    df = pd.read_csv(csv_file)
    df['error_low']=df['score']-df['confidence_interval_low']
    df['error_high']=df['confidence_interval_high'] - df['score']
    df['date'] = pd.to_datetime(df['date'])
    
    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Plot with error bars
    ax.errorbar(df['date'], df['score'], 
               yerr=[df['error_low'], df['error_high']], 
               fmt='o-', 
               color='#1f77b4',
               markersize=6,
               capsize=3,
               capthick=1,
               label='Model Performance')
    
    # Add labels
    for i, row in df.iterrows():
        ax.annotate(row['model'], 
                   xy=(row['date'], row['score']),
                   xytext=(5, 5), 
                   textcoords='offset points',
                   fontsize=9,
                   ha='left')
    
    ax.set_xlabel('Release Date')
    ax.set_ylabel('Overall Score')
    ax.set_title('AI Model Performance on RepliBench')
    ax.grid(True, alpha=0.3)
    ax.legend()
    
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        print(f"Simple plot saved to: {save_path}")
    
    return fig, ax

if __name__ == "__main__":
    # File paths
    csv_file = 'plot_data.csv'
    
    # Create the detailed plot
    print("Creating detailed RepliBench plot...")
    fig1, ax1 = create_replibench_plot(csv_file, 'replibench_detailed.png')
    
    # Create a simpler version
    print("Creating simple plot...")
    fig2, ax2 = create_simple_version(csv_file, 'replibench_simple.png')
    
    # Show the plots
    plt.show()
    
    print("\nPlot creation complete!")
    print("Files created:")
    print("- replibench_detailed.png (with logistic fit)")
    print("- replibench_simple.png (basic version)")
    
    # Display some statistics
    df = pd.read_csv(csv_file)
    print(f"\nData summary:")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"Score range: {df['score'].min():.3f} to {df['score'].max():.3f}")
    print(f"Number of models: {len(df)}")
