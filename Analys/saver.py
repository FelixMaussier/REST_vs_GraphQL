import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import json
import seaborn as sns
from matplotlib.ticker import MaxNLocator

# Set style for prettier graphs
plt.style.use('seaborn-v0_8-darkgrid')
# Custom color palette for REST and GraphQL
color_palette = {"REST": "#3B82F6",  # Blå
                "GraphQL": "#e535ab"}  # Rosa
plt.rcParams.update({'font.size': 12})

# 1. Load data from JSON file
with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 2. Improve analyze_data function to include endpoint details
def analyze_data(data):
    results = []
    for api_type in data:
        for endpoint in data[api_type]:
            endpoint_name = endpoint.replace('/', '')  # Remove slash for cleaner display
            for i, test_case in enumerate(data[api_type][endpoint]):
                test_data = test_case
                num_req = test_data["numOfReq"]
                
                # Convert all string values to float and handle arrays properly
                response_times = [float(x) for x in test_data["data"]["responseTime"]]
                cpu_usage = [float(x) for x in test_data["data"]["cpuArr"]]
                ram_usage = [float(x) for x in test_data["data"]["ramArr"]]
                size_bytes = [float(x) for x in test_data["data"]["sizeInBytes"]]
                
                # Calculate averages and standard deviations
                results.append({
                    "API": api_type,
                    "Endpoint": endpoint_name,
                    "Requests": num_req,
                    "AvgResponseTime": np.mean(response_times),
                    "StdResponseTime": np.std(response_times),
                    "MinResponseTime": np.min(response_times),
                    "MaxResponseTime": np.max(response_times),
                    "AvgCPU": np.mean(cpu_usage),
                    "StdCPU": np.std(cpu_usage),
                    "MinCPU": np.min(cpu_usage),
                    "MaxCPU": np.max(cpu_usage),
                    "AvgRAM": np.mean(ram_usage),
                    "StdRAM": np.std(ram_usage),
                    "MinRAM": np.min(ram_usage),
                    "MaxRAM": np.max(ram_usage),
                    "AvgSizeKB": np.mean(size_bytes),
                    "StdSizeKB": np.std(size_bytes),
                    "MinSizeKB": np.min(size_bytes),
                    "MaxSizeKB": np.max(size_bytes),
                    "SizePerRequestKB": np.mean(size_bytes) / num_req,  # Average size per request
                    "TotalSizeKB": np.sum(size_bytes)  # Total size across all requests
                })
    return pd.DataFrame(results)

# 3. Improved main metrics plot
def plot_metrics(df):
    # Create a figure with subplots
    fig = plt.figure(figsize=(18, 12))
    
    # Setup for 4 subplots
    ax1 = plt.subplot2grid((2, 2), (0, 0))
    ax2 = plt.subplot2grid((2, 2), (0, 1))
    ax3 = plt.subplot2grid((2, 2), (1, 0))
    ax4 = plt.subplot2grid((2, 2), (1, 1))
    
    # Create labels for x-axis that combine API type and request count
    df['label'] = df['API'] + '\n' + df['Requests'].astype(str) + ' req'
    
    # Graph 1: Response Time
    sns.barplot(x='label', y='AvgResponseTime', data=df, ax=ax1, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax1.set_title('Average Response Time by API Type and Request Count', fontweight='bold')
    ax1.set_ylabel('Response Time (ms)')
    ax1.set_xlabel('')
    # Add log scale for better visibility of small values
    if df['AvgResponseTime'].max() / df['AvgResponseTime'].min() > 10:
        ax1.set_yscale('log')
        ax1.set_ylabel('Response Time (ms) - Log Scale')
    
    # Graph 2: CPU Usage
    sns.barplot(x='label', y='AvgCPU', data=df, ax=ax2, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax2.set_title('Average CPU Usage by API Type and Request Count', fontweight='bold')
    ax2.set_ylabel('CPU Usage (%)')
    ax2.set_xlabel('')
    # Add warning about CPU measurements over 100%
    if df['AvgCPU'].max() > 100:
        ax2.text(0.5, 0.95, 'Note: CPU usage >100% indicates multi-core utilization',
                transform=ax2.transAxes, ha='center', va='top',
                bbox=dict(facecolor='yellow', alpha=0.3))
    
    # Graph 3: RAM Usage
    sns.barplot(x='label', y='AvgRAM', data=df, ax=ax3, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax3.set_title('Average RAM Usage by API Type and Request Count', fontweight='bold')
    ax3.set_ylabel('RAM Usage (MB)')  # Changed from GB to MB
    ax3.set_xlabel('')
    
    # Graph 4: Size per Request
    sns.barplot(x='label', y='SizePerRequestKB', data=df, ax=ax4, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax4.set_title('Average Size per Request by API Type', fontweight='bold')
    ax4.set_ylabel('Size per Request (KB)')
    ax4.set_xlabel('')
    
    # Add value labels on top of bars
    for ax in [ax1, ax2, ax3, ax4]:
        for container in ax.containers:
            ax.bar_label(container, fmt='%.2f', fontsize=9)
    
    # Remove duplicate legends
    handles, labels = ax1.get_legend_handles_labels()
    ax1.get_legend().remove()
    ax2.get_legend().remove()
    ax3.get_legend().remove()
    ax4.get_legend().remove()
    
    # Add a single legend for the entire figure
    fig.legend(handles, labels, loc='upper center', bbox_to_anchor=(0.5, 0.05), 
               fancybox=True, shadow=True, ncol=2)
    
    plt.tight_layout(rect=[0, 0.05, 1, 0.95])
    plt.suptitle('API Performance Comparison: REST vs GraphQL', fontsize=16, fontweight='bold')
    
    # Add endpoint details and measurement notes as annotation
    endpoint_info = (
        f"REST Endpoint: {df[df['API']=='REST']['Endpoint'].iloc[0]}\n"
        f"GraphQL Endpoint: {df[df['API']=='GraphQL']['Endpoint'].iloc[0]}\n\n"
        f"Measurement Notes:\n"
        f"- RAM is measured in MB (not GB)\n"
        f"- CPU usage >100% indicates multi-core utilization\n"
        f"- All measurements are averages across {df['Requests'].iloc[0]} requests"
    )
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, 
                bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 4. Improved detailed comparison with scaling
def plot_detailed_comparison(df):
    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    axes = axes.flatten()
    
    metrics = [
        {'col': 'AvgResponseTime', 'title': 'Response Time (ms)', 'idx': 0},
        {'col': 'AvgCPU', 'title': 'CPU Usage (%)', 'idx': 1},
        {'col': 'AvgRAM', 'title': 'RAM Usage (GB)', 'idx': 2},
        {'col': 'SizePerRequestKB', 'title': 'Size per Request (KB)', 'idx': 3}
    ]
    
    for metric in metrics:
        ax = axes[metric['idx']]
        
        # Prepare data for grouped bar chart with request counts
        pivot_data = df.pivot(index='API', columns='Requests', values=metric['col'])
        
        # Plot the data with custom colors
        bars = pivot_data.plot(kind='bar', ax=ax, rot=0, width=0.7, color=[color_palette.get(api, 'gray') for api in pivot_data.index])
        
        # Add value labels on top of bars
        for container in ax.containers:
            ax.bar_label(container, fmt='%.2f', fontweight='bold')
        
        # Set titles and labels
        ax.set_title(f'{metric["title"]} by Request Count', fontweight='bold')
        ax.set_ylabel(metric['title'])
        ax.set_xlabel('API Type')
        ax.grid(axis='y', linestyle='--', alpha=0.7)
        
        # Add legend with better title
        ax.legend(title='Requests')
    
    plt.tight_layout()
    plt.subplots_adjust(top=0.9)
    plt.suptitle('Detailed API Performance Metrics', fontsize=16, fontweight='bold')
    
    # Add endpoint details as annotation
    endpoint_info = f"REST Endpoint: {df[df['API']=='REST']['Endpoint'].iloc[0]}\nGraphQL Endpoint: {df[df['API']=='GraphQL']['Endpoint'].iloc[0]}"
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 5. NEW: Plot for scaling comparison (replacing heatmap)
def plot_scaling_comparison(df):
    # Create a figure with two subplots (side by side)
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
    
    # Process the data - group by API type and request count
    rest_data = df[df['API'] == 'REST'].sort_values('Requests')
    graphql_data = df[df['API'] == 'GraphQL'].sort_values('Requests')
    
    # Plot 1: Response Time Scaling
    ax1.plot(rest_data['Requests'], rest_data['AvgResponseTime'], 'o-', color=color_palette['REST'], 
             linewidth=2, markersize=8, label='REST')
    ax1.plot(graphql_data['Requests'], graphql_data['AvgResponseTime'], 'o-', color=color_palette['GraphQL'], 
             linewidth=2, markersize=8, label='GraphQL')
    
    ax1.set_title('Response Time Scaling with Request Volume', fontweight='bold')
    ax1.set_xlabel('Number of Requests')
    ax1.set_ylabel('Average Response Time (ms)')
    ax1.set_xscale('log')  # Log scale for better visualization across different request volumes
    ax1.grid(True, which="both", linestyle='--', alpha=0.7)
    ax1.legend()
    
    # Add data labels
    for _, row in rest_data.iterrows():
        ax1.annotate(f"{row['AvgResponseTime']:.0f}ms", 
                    (row['Requests'], row['AvgResponseTime']),
                    textcoords="offset points", 
                    xytext=(0,10), 
                    ha='center')
    
    for _, row in graphql_data.iterrows():
        ax1.annotate(f"{row['AvgResponseTime']:.0f}ms", 
                    (row['Requests'], row['AvgResponseTime']),
                    textcoords="offset points", 
                    xytext=(0,-15), 
                    ha='center')
    
    # Plot 2: CPU Usage Scaling
    ax2.plot(rest_data['Requests'], rest_data['AvgCPU'], 'o-', color=color_palette['REST'], 
             linewidth=2, markersize=8, label='REST')
    ax2.plot(graphql_data['Requests'], graphql_data['AvgCPU'], 'o-', color=color_palette['GraphQL'], 
             linewidth=2, markersize=8, label='GraphQL')
    
    ax2.set_title('CPU Usage Scaling with Request Volume', fontweight='bold')
    ax2.set_xlabel('Number of Requests')
    ax2.set_ylabel('Average CPU Usage (%)')
    ax2.set_xscale('log')  # Log scale for better visualization across different request volumes
    ax2.grid(True, which="both", linestyle='--', alpha=0.7)
    ax2.legend()
    
    # Add warning about CPU measurements over 100%
    if df['AvgCPU'].max() > 100:
        ax2.text(0.5, 0.95, 'Note: CPU usage >100% indicates multi-core utilization',
                transform=ax2.transAxes, ha='center', va='top',
                bbox=dict(facecolor='yellow', alpha=0.3))
    
    # Add data labels
    for _, row in rest_data.iterrows():
        ax2.annotate(f"{row['AvgCPU']:.0f}%", 
                    (row['Requests'], row['AvgCPU']),
                    textcoords="offset points", 
                    xytext=(0,10), 
                    ha='center')
    
    for _, row in graphql_data.iterrows():
        ax2.annotate(f"{row['AvgCPU']:.0f}%", 
                    (row['Requests'], row['AvgCPU']),
                    textcoords="offset points", 
                    xytext=(0,-15), 
                    ha='center')
    
    plt.tight_layout()
    plt.suptitle('API Performance Scaling Analysis', fontsize=16, fontweight='bold')
    plt.subplots_adjust(top=0.9)
    
    # Add endpoint details and measurement notes as annotation
    endpoint_info = (
        f"REST Endpoint: {df[df['API']=='REST']['Endpoint'].iloc[0]}\n"
        f"GraphQL Endpoint: {df[df['API']=='GraphQL']['Endpoint'].iloc[0]}\n\n"
        f"Measurement Notes:\n"
        f"- RAM is measured in MB (not GB)\n"
        f"- CPU usage >100% indicates multi-core utilization\n"
        f"- All measurements are averages across {df['Requests'].iloc[0]} requests"
    )
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, 
                bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 6. NEW: Add relative performance ratio plot
def plot_relative_performance(df):
    # Create a figure
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Group data by API and request count
    rest_df = df[df['API'] == 'REST'].sort_values('Requests')
    graphql_df = df[df['API'] == 'GraphQL'].sort_values('Requests')
    
    # Calculate ratios (GraphQL to REST)
    request_counts = rest_df['Requests'].unique()
    ratios = []
    
    for req in request_counts:
        rest_row = rest_df[rest_df['Requests'] == req]
        graphql_row = graphql_df[graphql_df['Requests'] == req]
        
        ratios.append({
            'Requests': req,
            'ResponseTimeRatio': graphql_row['AvgResponseTime'].iloc[0] / rest_row['AvgResponseTime'].iloc[0],
            'CPURatio': graphql_row['AvgCPU'].iloc[0] / rest_row['AvgCPU'].iloc[0],
            'RAMRatio': graphql_row['AvgRAM'].iloc[0] / rest_row['AvgRAM'].iloc[0],
            'SizeRatio': graphql_row['SizePerRequestKB'].iloc[0] / rest_row['SizePerRequestKB'].iloc[0]
        })
    
    ratio_df = pd.DataFrame(ratios)
    
    # Make the plot
    width = 0.2
    x = np.arange(len(request_counts))
    
    # Plot bars for each metric
    ax.bar(x - 1.5*width, ratio_df['ResponseTimeRatio'], width, label='Response Time Ratio', color='#FF9671')
    ax.bar(x - 0.5*width, ratio_df['CPURatio'], width, label='CPU Usage Ratio', color='#FFC75F')
    ax.bar(x + 0.5*width, ratio_df['RAMRatio'], width, label='RAM Usage Ratio', color='#845EC2')
    ax.bar(x + 1.5*width, ratio_df['SizeRatio'], width, label='Size Ratio', color='#00C9A7')
    
    # Add a horizontal line at y=1 (equal performance)
    ax.axhline(y=1, color='gray', linestyle='--', alpha=0.7)
    
    # Add the 1.0 marker for reference (equal performance)
    ax.text(-0.5, 1.05, 'Equal Performance (1.0)', color='gray', fontweight='bold')
    
    # Add ratio values on top of bars
    for i, metric in enumerate([ratio_df['ResponseTimeRatio'], ratio_df['CPURatio'], 
                              ratio_df['RAMRatio'], ratio_df['SizeRatio']]):
        position = x + (i - 1.5) * width
        for j, v in enumerate(metric):
            ax.text(position[j], v + 0.05, f'{v:.2f}x', ha='center', fontsize=9, fontweight='bold')
    
    # Customize the plot
    ax.set_ylabel('GraphQL to REST Ratio (higher means GraphQL uses more)')
    ax.set_xlabel('Number of Requests')
    ax.set_title('Relative Performance: GraphQL vs REST', fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(request_counts)
    ax.legend()
    ax.grid(axis='y', linestyle='--', alpha=0.7)
    
    # Add interpretation guide
    interpretation = "Values > 1: GraphQL requires more resources than REST\nValues < 1: GraphQL requires fewer resources than REST"
    plt.figtext(0.5, 0.01, interpretation, ha='center', fontsize=10, 
                bbox=dict(facecolor='white', edgecolor='gray', alpha=0.8))
    
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.1)
    
    return fig

# Main execution
df = analyze_data(data)

# Sort DataFrame for better visualization
df = df.sort_values(['API', 'Requests'])

# Print summary statistics
print("=== Performance Summary by API Type and Request Count ===")
summary = df.groupby(['API', 'Requests']).agg({
    'AvgResponseTime': ['mean', 'std'],
    'AvgCPU': ['mean', 'std'],
    'AvgRAM': ['mean', 'std'],
    'SizePerRequestKB': ['mean']
}).round(3)
print(summary)

print("\n=== Overall Average Metrics ===")
overall = pd.DataFrame({
    "Metric": ["Response Time (ms)", "CPU Usage (%)", "RAM Usage (GB)", "Size/Request (KB)"],
    "Total Avg": [df["AvgResponseTime"].mean(), df["AvgCPU"].mean(), 
                  df["AvgRAM"].mean(), df["SizePerRequestKB"].mean()]
})
print(overall)

# Get the key insights
rest_avg = df[df['API'] == 'REST']['AvgResponseTime'].mean()
graphql_avg = df[df['API'] == 'GraphQL']['AvgResponseTime'].mean()
rest_cpu = df[df['API'] == 'REST']['AvgCPU'].mean()
graphql_cpu = df[df['API'] == 'GraphQL']['AvgCPU'].mean()
rest_ram = df[df['API'] == 'REST']['AvgRAM'].mean()
graphql_ram = df[df['API'] == 'GraphQL']['AvgRAM'].mean()
rest_size = df[df['API'] == 'REST']['SizePerRequestKB'].mean()
graphql_size = df[df['API'] == 'GraphQL']['SizePerRequestKB'].mean()

print("\n=== Key Insights ===")
print(f"Endpoints compared: REST '{df[df['API']=='REST']['Endpoint'].iloc[0]}' vs GraphQL '{df[df['API']=='GraphQL']['Endpoint'].iloc[0]}'")
print(f"- GraphQL is approximately {(graphql_avg/rest_avg):.2f}x slower in response time compared to REST")
print(f"- GraphQL uses approximately {(graphql_cpu/rest_cpu):.2f}x more CPU resources compared to REST")
print(f"- GraphQL uses approximately {(graphql_ram/rest_ram):.2f}x more RAM compared to REST")
print(f"- GraphQL response size is approximately {(graphql_size/rest_size):.2f}x the size of REST responses per request")

# Create and save all visualizations
# 1. Main metrics plot
metrics_fig = plot_metrics(df)
plt.figure(metrics_fig.number)
plt.savefig('api_metrics_comparison.png', dpi=300, bbox_inches='tight')

# 2. Detailed comparison plot
detailed_fig = plot_detailed_comparison(df)
plt.figure(detailed_fig.number)
plt.savefig('api_detailed_comparison.png', dpi=300, bbox_inches='tight')

# 3. NEW: Scaling comparison plot (replacing heatmap)
scaling_fig = plot_scaling_comparison(df)
plt.figure(scaling_fig.number)
plt.savefig('api_scaling_comparison.png', dpi=300, bbox_inches='tight')

# 4. NEW: Relative performance plot
ratio_fig = plot_relative_performance(df)
plt.figure(ratio_fig.number)
plt.savefig('api_relative_performance.png', dpi=300, bbox_inches='tight')

plt.show()