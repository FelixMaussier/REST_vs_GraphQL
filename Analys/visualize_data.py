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

# 2. Modified analyze_data function without size calculations
def analyze_data(data):
    results = []
    for api_type in data:
        for endpoint in data[api_type]:
            endpoint_name = endpoint.replace('/', '')  # Remove slash for cleaner display
            for i, test_case in enumerate(data[api_type][endpoint]):
                test_data = test_case
                num_req = test_data["numOfReq"]
                response_times = [float(x) if isinstance(x, str) else x for x in test_data["data"]["responseTime"]]
                cpu_usage = [float(x) if isinstance(x, str) else x for x in test_data["data"]["cpuArr"]]
                ram_usage = [float(x) if isinstance(x, str) else x for x in test_data["data"]["ramArr"]]
                
                # Calculate averages and standard deviations (without size metrics)
                results.append({
                    "API": api_type,
                    "Endpoint": endpoint_name,
                    "Requests": num_req,
                    "AvgResponseTime": np.mean(response_times),
                    "StdResponseTime": np.std(response_times),
                    "AvgCPU": np.mean(cpu_usage),
                    "StdCPU": np.std(cpu_usage),
                    "AvgRAM": np.mean(ram_usage),
                    "StdRAM": np.std(ram_usage)
                })
    return pd.DataFrame(results)

# 3. Modified main metrics plot without size plot
def plot_metrics(df):
    # Create a figure with subplots (now only 3 plots)
    fig = plt.figure(figsize=(18, 12))
    
    # Setup for 3 subplots in a 2x2 grid (one space left empty)
    ax1 = plt.subplot2grid((2, 2), (0, 0))
    ax2 = plt.subplot2grid((2, 2), (0, 1))
    ax3 = plt.subplot2grid((2, 2), (1, 0))
    
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
    # Add log scale for better visibility of small values
    if df['AvgCPU'].max() / df['AvgCPU'].min() > 10:
        ax2.set_yscale('log')
        ax2.set_ylabel('CPU Usage (%) - Log Scale')
    
    # Graph 3: RAM Usage
    sns.barplot(x='label', y='AvgRAM', data=df, ax=ax3, 
                hue='API', palette=color_palette, errorbar=('ci', 95))
    ax3.set_title('Average RAM Usage by API Type and Request Count', fontweight='bold')
    ax3.set_ylabel('RAM Usage (GB)')
    ax3.set_xlabel('')
    # Add log scale for better visibility of small values
    if df['AvgRAM'].max() / df['AvgRAM'].min() > 10:
        ax3.set_yscale('log')
        ax3.set_ylabel('RAM Usage (MB) - Log Scale')
    
    # Remove duplicate legends
    handles, labels = ax1.get_legend_handles_labels()
    ax1.get_legend().remove()
    ax2.get_legend().remove()
    ax3.get_legend().remove()
    
    # Add a single legend for the entire figure
    fig.legend(handles, labels, loc='upper center', bbox_to_anchor=(0.5, 0.05), 
               fancybox=True, shadow=True, ncol=2)
    
    plt.tight_layout(rect=[0, 0.05, 1, 0.95])
    plt.suptitle('API Performance Comparison: REST vs GraphQL', fontsize=16, fontweight='bold')
    
    # Add endpoint details as annotation
    endpoint_info = f"REST Endpoint: {df[df['API']=='REST']['Endpoint'].iloc[0]}\nGraphQL Endpoint: {df[df['API']=='GraphQL']['Endpoint'].iloc[0]}"
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 4. Modified detailed comparison without size plot
def plot_detailed_comparison(df):
    import matplotlib.colors as mcolors

    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    axes = axes.flatten()

    # Färger: nyanser av blått för REST och rosa för GraphQL
    unique_requests = sorted(df['Requests'].unique())
    rest_colors = sns.light_palette("#3B82F6", n_colors=len(unique_requests))
    graphql_colors = sns.light_palette("#e535ab", n_colors=len(unique_requests))

    metrics = [
        {'col': 'AvgResponseTime', 'title': 'Response Time (ms)', 'idx': 0},
        {'col': 'AvgCPU', 'title': 'CPU Usage (%)', 'idx': 1},
        {'col': 'AvgRAM', 'title': 'RAM Usage (MB)', 'idx': 2}
    ]

    for metric in metrics:
        ax = axes[metric['idx']]
        pivot_data = df.pivot(index='API', columns='Requests', values=metric['col'])

        # Skapa en lista med färger per bar för varje rad
        bar_colors = []
        for api in pivot_data.index:
            if api == 'REST':
                bar_colors.append(rest_colors)
            elif api == 'GraphQL':
                bar_colors.append(graphql_colors)

        # Transponera för att rita varje Requests-grupp separat med rätt färg per API
        bars = []
        for i, request in enumerate(pivot_data.columns):
            colors = [bar_colors[row_idx][i] for row_idx in range(len(pivot_data.index))]
            bar = ax.bar(
                x=[x + i * 0.13 for x in range(len(pivot_data.index))],  # små förskjutningar
                height=pivot_data[request],
                width=0.12,
                label=str(request),
                color=colors
            )
            bars.append(bar)

        # Lägg till etiketter ovanpå varje stapel
        for bar_group in bars:
            ax.bar_label(bar_group, fmt='%.2f', fontsize=8)

        ax.set_title(f'{metric["title"]} by Request Count', fontweight='bold')
        ax.set_ylabel(metric['title'])
        ax.set_xlabel('API Type')
        ax.set_xticks(range(len(pivot_data.index)))
        ax.set_xticklabels(pivot_data.index)
        ax.grid(axis='y', linestyle='--', alpha=0.7)
        ax.legend(title='Requests')

    fig.delaxes(axes[3])
    plt.tight_layout()
    plt.subplots_adjust(top=0.9)
    plt.suptitle('Detailed API Performance Metrics', fontsize=16, fontweight='bold')

    # Lägg till endpoint info
    endpoint_info = f"REST Endpoint: {df[df['API']=='REST']['Endpoint'].iloc[0]}\nGraphQL Endpoint: {df[df['API']=='GraphQL']['Endpoint'].iloc[0]}"
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, bbox=dict(facecolor='white', alpha=0.8))

    return fig
    import matplotlib.colors as mcolors

    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    axes = axes.flatten()

    # Skapa nyanser av blå för REST och rosa för GraphQL
    rest_colors = sns.light_palette("#3B82F6", n_colors=len(df['Requests'].unique()))
    graphql_colors = sns.light_palette("#e535ab", n_colors=len(df['Requests'].unique()))

    metrics = [
        {'col': 'AvgResponseTime', 'title': 'Response Time (ms)', 'idx': 0},
        {'col': 'AvgCPU', 'title': 'CPU Usage (%)', 'idx': 1},
        {'col': 'AvgRAM', 'title': 'RAM Usage (MB)', 'idx': 2}
    ]

    for metric in metrics:
        ax = axes[metric['idx']]
        pivot_data = df.pivot(index='API', columns='Requests', values=metric['col'])

        # Välj färger per API
        colors = []
        for api in pivot_data.index:
            if api == 'REST':
                colors = rest_colors
            else:
                colors = graphql_colors

            # Färger per bar (en per kolumn/antal requests)
            bar_colors = colors[:len(pivot_data.columns)]

        bars = pivot_data.plot(kind='bar', ax=ax, rot=0, width=0.7, color=bar_colors)

        for container in ax.containers:
            ax.bar_label(container, fmt='%.2f', fontweight='bold')

        ax.set_title(f'{metric["title"]} by Request Count', fontweight='bold')
        ax.set_ylabel(metric['title'])
        ax.set_xlabel('API Type')
        ax.grid(axis='y', linestyle='--', alpha=0.7)
        ax.legend(title='Requests')

    fig.delaxes(axes[3])
    plt.tight_layout()
    plt.subplots_adjust(top=0.9)
    plt.suptitle('Detailed API Performance Metrics', fontsize=16, fontweight='bold')

    # Lägg till endpoint info
    endpoint_info = f"REST Endpoint: {df[df['API']=='REST']['Endpoint'].iloc[0]}\nGraphQL Endpoint: {df[df['API']=='GraphQL']['Endpoint'].iloc[0]}"
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, bbox=dict(facecolor='white', alpha=0.8))

    return fig
# 5. Modified scaling comparison without size plot
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
    
    # Add endpoint details as annotation
    endpoint_info = f"REST Endpoint: {df[df['API']=='REST']['Endpoint'].iloc[0]}\nGraphQL Endpoint: {df[df['API']=='GraphQL']['Endpoint'].iloc[0]}"
    plt.figtext(0.5, 0.01, endpoint_info, ha='center', fontsize=10, bbox=dict(facecolor='white', alpha=0.8))
    
    return fig

# 6. Modified relative performance plot without size ratio
def plot_relative_performance(df):
    # Create a figure
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Group data by API and request count
    rest_df = df[df['API'] == 'REST'].sort_values('Requests')
    graphql_df = df[df['API'] == 'GraphQL'].sort_values('Requests')
    
    # Calculate ratios (GraphQL to REST) - without size ratio
    request_counts = rest_df['Requests'].unique()
    ratios = []
    
    for req in request_counts:
        rest_row = rest_df[rest_df['Requests'] == req]
        graphql_row = graphql_df[graphql_df['Requests'] == req]
        
        ratios.append({
            'Requests': req,
            'ResponseTimeRatio': graphql_row['AvgResponseTime'].iloc[0] / rest_row['AvgResponseTime'].iloc[0],
            'CPURatio': graphql_row['AvgCPU'].iloc[0] / rest_row['AvgCPU'].iloc[0],
            'RAMRatio': graphql_row['AvgRAM'].iloc[0] / rest_row['AvgRAM'].iloc[0]
        })
    
    ratio_df = pd.DataFrame(ratios)
    
    # Make the plot with 3 metrics instead of 4
    width = 0.25
    x = np.arange(len(request_counts))
    
    # Plot bars for each metric
    ax.bar(x - width, ratio_df['ResponseTimeRatio'], width, label='Response Time Ratio', color='#FF9671')
    ax.bar(x, ratio_df['CPURatio'], width, label='CPU Usage Ratio', color='#FFC75F')
    ax.bar(x + width, ratio_df['RAMRatio'], width, label='RAM Usage Ratio', color='#845EC2')
    
    # Add a horizontal line at y=1 (equal performance)
    ax.axhline(y=1, color='gray', linestyle='--', alpha=0.7)
    
    # Add the 1.0 marker for reference (equal performance)
    ax.text(-0.5, 1.05, 'Equal Performance (1.0)', color='gray', fontweight='bold')
    
    # Add ratio values on top of bars
    for i, metric in enumerate([ratio_df['ResponseTimeRatio'], ratio_df['CPURatio'], ratio_df['RAMRatio']]):
        position = x + (i - 1) * width
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

# Print summary statistics (without size metrics)
print("=== Performance Summary by API Type and Request Count ===")
summary = df.groupby(['API', 'Requests']).agg({
    'AvgResponseTime': ['mean', 'std'],
    'AvgCPU': ['mean', 'std'],
    'AvgRAM': ['mean', 'std']
}).round(3)
print(summary)

print("\n=== Overall Average Metrics ===")
overall = pd.DataFrame({
    "Metric": ["Response Time (ms)", "CPU Usage (%)", "RAM Usage (MB)"],
    "Total Avg": [df["AvgResponseTime"].mean(), df["AvgCPU"].mean(), df["AvgRAM"].mean()]
})
print(overall)

# Get the key insights (without size comparison)
print("\n=== Key Insights ===")
print(f"Endpoints compared: REST '{df[df['API']=='REST']['Endpoint'].iloc[0]}' vs GraphQL '{df[df['API']=='GraphQL']['Endpoint'].iloc[0]}'")
print(f"- GraphQL is approximately {(df[df['API']=='GraphQL']['AvgResponseTime'].mean()/df[df['API']=='REST']['AvgResponseTime'].mean()):.2f}x slower in response time compared to REST")
print(f"- GraphQL uses approximately {(df[df['API']=='GraphQL']['AvgCPU'].mean()/df[df['API']=='REST']['AvgCPU'].mean()):.2f}x more CPU resources compared to REST")
print(f"- GraphQL uses approximately {(df[df['API']=='GraphQL']['AvgRAM'].mean()/df[df['API']=='REST']['AvgRAM'].mean()):.2f}x more RAM compared to REST")

# Create and save all visualizations
# 1. Main metrics plot
metrics_fig = plot_metrics(df)
plt.figure(metrics_fig.number)
plt.savefig('api_metrics_comparison.png', dpi=300, bbox_inches='tight')

# 2. Detailed comparison plot
detailed_fig = plot_detailed_comparison(df)
plt.figure(detailed_fig.number)
plt.savefig('api_detailed_comparison.png', dpi=300, bbox_inches='tight')

# 3. Scaling comparison plot
scaling_fig = plot_scaling_comparison(df)
plt.figure(scaling_fig.number)
plt.savefig('api_scaling_comparison.png', dpi=300, bbox_inches='tight')

# 4. Relative performance plot
ratio_fig = plot_relative_performance(df)
plt.figure(ratio_fig.number)
plt.savefig('api_relative_performance.png', dpi=300, bbox_inches='tight')

plt.show()