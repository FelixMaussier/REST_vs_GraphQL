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

# 2. Improved analyze_data function optimized for small sequential request counts
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

# 3. Main metrics plot optimized for small request counts (1-5)
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
    
    # Sort the dataframe by API type and request count for better visualization
    df_sorted = df.sort_values(['API', 'Requests'])
    
    # Graph 1: Response Time (NO LOG SCALE for small values)
    bars1 = sns.barplot(x='label', y='AvgResponseTime', data=df_sorted, ax=ax1, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax1.set_title('Average Response Time by API Type and Request Count', fontweight='bold')
    ax1.set_ylabel('Response Time (ms)')
    ax1.set_xlabel('')
    ax1.tick_params(axis='x', rotation=0)  # No rotation needed for small counts
    
    # Graph 2: CPU Usage
    bars2 = sns.barplot(x='label', y='AvgCPU', data=df_sorted, ax=ax2, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax2.set_title('Average CPU Usage by API Type and Request Count', fontweight='bold')
    ax2.set_ylabel('CPU Usage (%)')
    ax2.set_xlabel('')
    ax2.tick_params(axis='x', rotation=0)
    
    # Add warning about CPU measurements over 100%
    if df_sorted['AvgCPU'].max() > 100:
        ax2.text(0.5, 0.95, 'Note: CPU usage >100% indicates multi-core utilization',
                transform=ax2.transAxes, ha='center', va='top',
                bbox=dict(facecolor='yellow', alpha=0.3))
    
    # Graph 3: RAM Usage
    bars3 = sns.barplot(x='label', y='AvgRAM', data=df_sorted, ax=ax3, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax3.set_title('Average RAM Usage by API Type and Request Count', fontweight='bold')
    ax3.set_ylabel('RAM Usage (MB)')
    ax3.set_xlabel('')
    ax3.tick_params(axis='x', rotation=0)
    
    # Graph 4: Size per Request
    bars4 = sns.barplot(x='label', y='SizePerRequestKB', data=df_sorted, ax=ax4, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax4.set_title('Average Size per Request by API Type', fontweight='bold')
    ax4.set_ylabel('Size per Request (KB)')
    ax4.set_xlabel('')
    ax4.tick_params(axis='x', rotation=0)
    
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
    
    plt.tight_layout(rect=[0, 0.1, 1, 0.95])
    plt.suptitle('API Performance Comparison: REST vs GraphQL (Small Request Counts)', fontsize=16, fontweight='bold')
    
    # Get unique endpoints for each API type
    rest_endpoints = df[df['API']=='REST']['Endpoint'].unique()
    graphql_endpoints = df[df['API']=='GraphQL']['Endpoint'].unique()
    
    # Add endpoint details and measurement notes as annotation
    endpoint_info = (
        f"REST Endpoint(s): {', '.join(rest_endpoints)}\n"
        f"GraphQL Endpoint(s): {', '.join(graphql_endpoints)}\n\n"
        f"Measurement Notes:\n"
        f"- RAM is measured in MB\n"
        f"- CPU usage >100% indicates multi-core utilization\n"
        f"- Request counts tested: {sorted(df['Requests'].unique())}"
    )
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, 
                bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 4. Detailed comparison optimized for small request counts
def plot_detailed_comparison(df):
    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    axes = axes.flatten()
    
    metrics = [
        {'col': 'AvgResponseTime', 'title': 'Response Time (ms)', 'idx': 0},
        {'col': 'AvgCPU', 'title': 'CPU Usage (%)', 'idx': 1},
        {'col': 'AvgRAM', 'title': 'RAM Usage (MB)', 'idx': 2},
        {'col': 'SizePerRequestKB', 'title': 'Size per Request (KB)', 'idx': 3}
    ]
    
    for metric in metrics:
        ax = axes[metric['idx']]
        
        # Prepare data for grouped bar chart with request counts
        # Sort by requests to ensure consistent ordering
        df_sorted = df.sort_values(['API', 'Requests'])
        pivot_data = df_sorted.pivot(index='API', columns='Requests', values=metric['col'])
        
        # Plot the data with custom colors
        bars = pivot_data.plot(kind='bar', ax=ax, rot=0, width=0.7, 
                              color=[color_palette.get(api, 'gray') for api in pivot_data.index])
        
        # Add value labels on top of bars
        for container in ax.containers:
            ax.bar_label(container, fmt='%.2f', fontweight='bold', fontsize=9)
        
        # Set titles and labels
        ax.set_title(f'{metric["title"]} by Request Count', fontweight='bold')
        ax.set_ylabel(metric['title'])
        ax.set_xlabel('API Type')
        ax.grid(axis='y', linestyle='--', alpha=0.7)
        
        # Add legend with better title
        ax.legend(title='Requests', bbox_to_anchor=(1.05, 1), loc='upper left')
    
    plt.tight_layout()
    plt.subplots_adjust(top=0.9, right=0.85)
    plt.suptitle('Detailed API Performance Metrics (Small Request Counts)', fontsize=16, fontweight='bold')
    
    # Get unique endpoints for each API type
    rest_endpoints = df[df['API']=='REST']['Endpoint'].unique()
    graphql_endpoints = df[df['API']=='GraphQL']['Endpoint'].unique()
    
    # Add endpoint details as annotation
    endpoint_info = (
        f"REST Endpoint(s): {', '.join(rest_endpoints)}\n"
        f"GraphQL Endpoint(s): {', '.join(graphql_endpoints)}"
    )
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, 
                bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 5. Scaling comparison optimized for sequential small values (1-5)
def plot_scaling_comparison(df):
    # Create a figure with two subplots (side by side)
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
    
    # Process the data - group by API type and request count
    rest_data = df[df['API'] == 'REST'].sort_values('Requests')
    graphql_data = df[df['API'] == 'GraphQL'].sort_values('Requests')
    
    # Plot 1: Response Time Scaling (LINEAR SCALE for small values)
    ax1.plot(rest_data['Requests'], rest_data['AvgResponseTime'], 'o-', color=color_palette['REST'], 
             linewidth=3, markersize=10, label='REST')
    ax1.plot(graphql_data['Requests'], graphql_data['AvgResponseTime'], 'o-', color=color_palette['GraphQL'], 
             linewidth=3, markersize=10, label='GraphQL')
    
    ax1.set_title('Response Time Scaling with Request Volume', fontweight='bold')
    ax1.set_xlabel('Number of Requests')
    ax1.set_ylabel('Average Response Time (ms)')
    
    # Use linear scale for small values and set integer ticks
    ax1.set_xlim(0.5, max(df['Requests']) + 0.5)
    ax1.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax1.grid(True, linestyle='--', alpha=0.7)
    ax1.legend()
    
    # Add data labels for each point
    for _, row in rest_data.iterrows():
        ax1.annotate(f"{row['AvgResponseTime']:.1f}ms", 
                    (row['Requests'], row['AvgResponseTime']),
                    textcoords="offset points", 
                    xytext=(0,15), 
                    ha='center', fontsize=10, fontweight='bold')
    
    for _, row in graphql_data.iterrows():
        ax1.annotate(f"{row['AvgResponseTime']:.1f}ms", 
                    (row['Requests'], row['AvgResponseTime']),
                    textcoords="offset points", 
                    xytext=(0,-20), 
                    ha='center', fontsize=10, fontweight='bold')
    
    # Plot 2: CPU Usage Scaling (LINEAR SCALE for small values)
    ax2.plot(rest_data['Requests'], rest_data['AvgCPU'], 'o-', color=color_palette['REST'], 
             linewidth=3, markersize=10, label='REST')
    ax2.plot(graphql_data['Requests'], graphql_data['AvgCPU'], 'o-', color=color_palette['GraphQL'], 
             linewidth=3, markersize=10, label='GraphQL')
    
    ax2.set_title('CPU Usage Scaling with Request Volume', fontweight='bold')
    ax2.set_xlabel('Number of Requests')
    ax2.set_ylabel('Average CPU Usage (%)')
    
    # Use linear scale for small values and set integer ticks
    ax2.set_xlim(0.5, max(df['Requests']) + 0.5)
    ax2.xaxis.set_major_locator(MaxNLocator(integer=True))
    ax2.grid(True, linestyle='--', alpha=0.7)
    ax2.legend()
    
    # Add warning about CPU measurements over 100%
    if df['AvgCPU'].max() > 100:
        ax2.text(0.5, 0.95, 'Note: CPU usage >100% indicates multi-core utilization',
                transform=ax2.transAxes, ha='center', va='top',
                bbox=dict(facecolor='yellow', alpha=0.3))
    
    # Add data labels for each point
    for _, row in rest_data.iterrows():
        ax2.annotate(f"{row['AvgCPU']:.1f}%", 
                    (row['Requests'], row['AvgCPU']),
                    textcoords="offset points", 
                    xytext=(0,15), 
                    ha='center', fontsize=10, fontweight='bold')
    
    for _, row in graphql_data.iterrows():
        ax2.annotate(f"{row['AvgCPU']:.1f}%", 
                    (row['Requests'], row['AvgCPU']),
                    textcoords="offset points", 
                    xytext=(0,-20), 
                    ha='center', fontsize=10, fontweight='bold')
    
    plt.tight_layout()
    plt.suptitle('API Performance Scaling Analysis (1-5 Requests)', fontsize=16, fontweight='bold')
    plt.subplots_adjust(top=0.9)
    
    # Get unique endpoints for each API type
    rest_endpoints = df[df['API']=='REST']['Endpoint'].unique()
    graphql_endpoints = df[df['API']=='GraphQL']['Endpoint'].unique()
    
    # Add endpoint details and measurement notes as annotation
    endpoint_info = (
        f"REST Endpoint(s): {', '.join(rest_endpoints)}\n"
        f"GraphQL Endpoint(s): {', '.join(graphql_endpoints)}\n\n"
        f"Request counts tested: {sorted(df['Requests'].unique())}\n"
        f"Measurement Notes:\n"
        f"- RAM is measured in MB\n"
        f"- Linear scale used for small request counts\n"
        f"- CPU usage >100% indicates multi-core utilization"
    )
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, 
                bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 6. Relative performance ratio plot optimized for small request counts
def plot_relative_performance(df):
    # Create a figure
    fig, ax = plt.subplots(figsize=(14, 8))
    
    # Group data by API and request count
    rest_df = df[df['API'] == 'REST'].sort_values('Requests')
    graphql_df = df[df['API'] == 'GraphQL'].sort_values('Requests')
    
    # Get all unique request counts that appear in both APIs
    rest_requests = set(rest_df['Requests'].unique())
    graphql_requests = set(graphql_df['Requests'].unique())
    common_requests = sorted(rest_requests.intersection(graphql_requests))
    
    if not common_requests:
        print("Warning: No common request counts found between REST and GraphQL data")
        return fig
    
    # Calculate ratios (GraphQL to REST) for common request counts
    ratios = []
    
    for req in common_requests:
        rest_row = rest_df[rest_df['Requests'] == req]
        graphql_row = graphql_df[graphql_df['Requests'] == req]
        
        if not rest_row.empty and not graphql_row.empty:
            ratios.append({
                'Requests': req,
                'ResponseTimeRatio': graphql_row['AvgResponseTime'].iloc[0] / rest_row['AvgResponseTime'].iloc[0],
                'CPURatio': graphql_row['AvgCPU'].iloc[0] / rest_row['AvgCPU'].iloc[0],
                'RAMRatio': graphql_row['AvgRAM'].iloc[0] / rest_row['AvgRAM'].iloc[0],
                'SizeRatio': graphql_row['SizePerRequestKB'].iloc[0] / rest_row['SizePerRequestKB'].iloc[0]
            })
    
    if not ratios:
        print("Warning: No valid ratio data could be calculated")
        return fig
    
    ratio_df = pd.DataFrame(ratios)
    
    # Set bar width for small number of groups
    width = 0.18
    x = np.arange(len(common_requests))
    
    # Plot bars for each metric
    bars1 = ax.bar(x - 1.5*width, ratio_df['ResponseTimeRatio'], width, 
                   label='Response Time Ratio', color='#FF9671')
    bars2 = ax.bar(x - 0.5*width, ratio_df['CPURatio'], width, 
                   label='CPU Usage Ratio', color='#FFC75F')
    bars3 = ax.bar(x + 0.5*width, ratio_df['RAMRatio'], width, 
                   label='RAM Usage Ratio', color='#845EC2')
    bars4 = ax.bar(x + 1.5*width, ratio_df['SizeRatio'], width, 
                   label='Size Ratio', color='#00C9A7')
    
    # Add a horizontal line at y=1 (equal performance)
    ax.axhline(y=1, color='gray', linestyle='--', alpha=0.7, linewidth=2)
    
    # Add the 1.0 marker for reference (equal performance)
    ax.text(-0.5, 1.05, 'Equal Performance (1.0)', color='gray', fontweight='bold')
    
    # Add ratio values on top of bars
    for bars, metric in zip([bars1, bars2, bars3, bars4], 
                           [ratio_df['ResponseTimeRatio'], ratio_df['CPURatio'], 
                            ratio_df['RAMRatio'], ratio_df['SizeRatio']]):
        for bar, value in zip(bars, metric):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.05,
                   f'{value:.2f}x', ha='center', va='bottom', fontsize=10, fontweight='bold')
    
    # Customize the plot
    ax.set_ylabel('GraphQL to REST Ratio\n(higher means GraphQL uses more)', fontsize=12)
    ax.set_xlabel('Number of Requests', fontsize=12)
    ax.set_title('Relative Performance: GraphQL vs REST (Small Request Counts)', fontweight='bold', fontsize=14)
    ax.set_xticks(x)
    ax.set_xticklabels(common_requests)
    ax.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    ax.grid(axis='y', linestyle='--', alpha=0.7)
    
    # Set y-axis limits to better show the data
    y_min = min(ratio_df.min()[1:]) * 0.9  # Exclude 'Requests' column
    y_max = max(ratio_df.max()[1:]) * 1.1
    ax.set_ylim(max(0, y_min), y_max)
    
    # Add interpretation guide
    interpretation = (
        "Values > 1: GraphQL requires more resources than REST\n"
        "Values < 1: GraphQL requires fewer resources than REST\n\n"
        f"Request counts analyzed: {common_requests}\n"
        "Linear progression ideal for analyzing small incremental changes"
    )
    plt.figtext(0.5, 0.01, interpretation, ha='center', fontsize=10, 
                bbox=dict(facecolor='white', edgecolor='gray', alpha=0.8))
    
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.15, right=0.85)
    
    return fig

# 7. Summary table optimized for small request analysis
def create_summary_table(df):
    """Create a comprehensive summary table of all metrics for small request counts"""
    # Group by API type and calculate summary statistics
    summary_stats = []
    
    for api_type in df['API'].unique():
        api_data = df[df['API'] == api_type]
        request_range = f"{api_data['Requests'].min()}-{api_data['Requests'].max()}"
        
        summary_stats.append({
            'API Type': api_type,
            'Endpoints Tested': ', '.join(api_data['Endpoint'].unique()),
            'Request Range': request_range,
            'Individual Counts': ', '.join(map(str, sorted(api_data['Requests'].unique()))),
            'Avg Response Time (ms)': f"{api_data['AvgResponseTime'].mean():.2f} ± {api_data['AvgResponseTime'].std():.2f}",
            'Avg CPU Usage (%)': f"{api_data['AvgCPU'].mean():.2f} ± {api_data['AvgCPU'].std():.2f}",
            'Avg RAM Usage (MB)': f"{api_data['AvgRAM'].mean():.2f} ± {api_data['AvgRAM'].std():.2f}",
            'Avg Size/Request (KB)': f"{api_data['SizePerRequestKB'].mean():.2f} ± {api_data['SizePerRequestKB'].std():.2f}",
        })
    
    return pd.DataFrame(summary_stats)

# Main execution
df = analyze_data(data)

# Sort DataFrame for better visualization
df = df.sort_values(['API', 'Requests'])

# Print enhanced summary statistics optimized for small request counts
print("=== Performance Analysis for Small Request Counts (1-5) ===")
request_counts = sorted(df['Requests'].unique())
print(f"Request counts analyzed: {request_counts}")
print(f"Request range: {min(request_counts)}-{max(request_counts)}")

# Group by API type and calculate statistics
for api_type in df['API'].unique():
    api_data = df[df['API'] == api_type]
    print(f"\n{api_type} API:")
    print(f"  Endpoints: {', '.join(api_data['Endpoint'].unique())}")
    print(f"  Request counts tested: {sorted(api_data['Requests'].unique())}")
    
    # Show detailed breakdown for each request count
    for req_count in sorted(api_data['Requests'].unique()):
        req_data = api_data[api_data['Requests'] == req_count]
        print(f"    {req_count} requests:")
        print(f"      Response Time: {req_data['AvgResponseTime'].iloc[0]:.2f} ms")
        print(f"      CPU Usage: {req_data['AvgCPU'].iloc[0]:.2f} %")
        print(f"      RAM Usage: {req_data['AvgRAM'].iloc[0]:.2f} MB")
        print(f"      Size/Request: {req_data['SizePerRequestKB'].iloc[0]:.2f} KB")

print("\n=== Overall Average Metrics Across All Tests ===")
overall = pd.DataFrame({
    "Metric": ["Response Time (ms)", "CPU Usage (%)", "RAM Usage (MB)", "Size/Request (KB)"],
    "REST Avg": [
        df[df['API'] == 'REST']["AvgResponseTime"].mean(),
        df[df['API'] == 'REST']["AvgCPU"].mean(),
        df[df['API'] == 'REST']["AvgRAM"].mean(),
        df[df['API'] == 'REST']["SizePerRequestKB"].mean()
    ],
    "GraphQL Avg": [
        df[df['API'] == 'GraphQL']["AvgResponseTime"].mean(),
        df[df['API'] == 'GraphQL']["AvgCPU"].mean(),
        df[df['API'] == 'GraphQL']["AvgRAM"].mean(),
        df[df['API'] == 'GraphQL']["SizePerRequestKB"].mean()
    ]
})
overall["Ratio (GraphQL/REST)"] = overall["GraphQL Avg"] / overall["REST Avg"]
print(overall.round(3))

# Create and display comprehensive summary table
print("\n=== Comprehensive Summary Table (Small Request Counts) ===")
summary_table = create_summary_table(df)
print(summary_table.to_string(index=False))

# Get the key insights (only if both API types exist)
if 'REST' in df['API'].values and 'GraphQL' in df['API'].values:
    rest_avg = df[df['API'] == 'REST']['AvgResponseTime'].mean()
    graphql_avg = df[df['API'] == 'GraphQL']['AvgResponseTime'].mean()
    rest_cpu = df[df['API'] == 'REST']['AvgCPU'].mean()
    graphql_cpu = df[df['API'] == 'GraphQL']['AvgCPU'].mean()
    rest_ram = df[df['API'] == 'REST']['AvgRAM'].mean()
    graphql_ram = df[df['API'] == 'GraphQL']['AvgRAM'].mean()
    rest_size = df[df['API'] == 'REST']['SizePerRequestKB'].mean()
    graphql_size = df[df['API'] == 'GraphQL']['SizePerRequestKB'].mean()

    print("\n=== Key Insights (Small Request Count Analysis) ===")
    rest_endpoints = ', '.join(df[df['API']=='REST']['Endpoint'].unique())
    graphql_endpoints = ', '.join(df[df['API']=='GraphQL']['Endpoint'].unique())
    print(f"Endpoints compared: REST '{rest_endpoints}' vs GraphQL '{graphql_endpoints}'")
    print(f"Request counts tested: {sorted(df['Requests'].unique())}")
    print(f"Analysis optimized for small, incremental request counts (1-5)")
    print(f"- GraphQL is approximately {(graphql_avg/rest_avg):.2f}x slower in response time compared to REST")
    print(f"- GraphQL uses approximately {(graphql_cpu/rest_cpu):.2f}x more CPU resources compared to REST")
    print(f"- GraphQL uses approximately {(graphql_ram/rest_ram):.2f}x more RAM compared to REST")
    print(f"- GraphQL response size is approximately {(graphql_size/rest_size):.2f}x the size of REST responses per request")

# Create and save all visualizations optimized for small request counts
try:
    # 1. Main metrics plot
    print("\nGenerating main metrics comparison (optimized for 1-5 requests)...")
    metrics_fig = plot_metrics(df)
    plt.figure(metrics_fig.number)
    plt.savefig('api_metrics_comparison_small.png', dpi=300, bbox_inches='tight')

    # 2. Detailed comparison plot
    print("Generating detailed comparison (small request counts)...")
    detailed_fig = plot_detailed_comparison(df)
    plt.figure(detailed_fig.number)
    plt.savefig('api_detailed_comparison_small.png', dpi=300, bbox_inches='tight')

    # 3. Scaling comparison plot
    print("Generating scaling comparison (linear scale for 1-5 requests)...")
    scaling_fig = plot_scaling_comparison(df)
    plt.figure(scaling_fig.number)
    plt.savefig('api_scaling_comparison_small.png', dpi=300, bbox_inches='tight')

    # 4. Relative performance plot (only if both APIs exist)
    if 'REST' in df['API'].values and 'GraphQL' in df['API'].values:
        print("Generating relative performance comparison (small increments)...")
        ratio_fig = plot_relative_performance(df)
        plt.figure(ratio_fig.number)
        plt.savefig('api_relative_performance_small.png', dpi=300, bbox_inches='tight')

    print("\nAll visualizations generated successfully for small request count analysis!")
    print("Charts optimized for analyzing performance with 1-5 requests")
    plt.show()

except Exception as e:
    print(f"Error generating visualizations: {e}")
    import traceback
    traceback.print_exc()