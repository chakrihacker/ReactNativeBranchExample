/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import branch, { BranchEvent } from 'react-native-branch'

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

class App extends React.Component {
  state = {
    branchLink: "Click on create url"
  }

  componentDidMount() {
    this.subscribeToBranch()
  }

  subscribeToBranch = () => {
    branch.subscribe(({ error, params }) => {
  if (error) {
    console.error('Error from Branch: ' + error)
    return
  }

  // params will never be null if error is null

  if (params['+non_branch_link']) {
    const nonBranchUrl = params['+non_branch_link']
    // Route non-Branch URL if appropriate.
    return
  }

  if (!params['+clicked_branch_link']) {
    // Indicates initialization success and some other conditions.
    // No link was opened.
    return
  }

  // A Branch link was opened.
  // Route link based on data in params, e.g.

  // Get title and url for route
  const title = params.$og_title
  const url = params.$canonical_url
  const image = params.$og_image_url

  // Now push the view for this URL
  console.log(title, url, image)
})
  }
  

  showShare = async () => {
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
      locallyIndex: true,
      title: 'Cool Content!',
      contentDescription: 'Cool Content Description',
      contentMetadata: {
        ratingAverage: 4.2,
        customMetadata: {
          prop1: 'test',
          prop2: 'abc'
        }
      }
    })

    let shareOptions = { messageHeader: 'Check this out', messageBody: 'No really, check this out!' }
    let linkProperties = { feature: 'share', channel: 'RNApp' }
    let controlParams = { $desktop_url: 'http://example.com/home', $ios_url: 'http://example.com/ios' }
    let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
    console.log(channel, completed, error)
  }

  createBranchLink = async () => {
    // only canonicalIdentifier is required
    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
      locallyIndex: true,
      title: 'Cool Content!',
      contentDescription: 'Cool Content Description',
      contentMetadata: {
        ratingAverage: 4.2,
        customMetadata: {
          prop1: 'test',
          prop2: 'abc'
        }
      }
    })

    let linkProperties = {
        feature: 'share',
        channel: 'facebook'
    }

    let controlParams = {
        $desktop_url: 'http://desktop-url.com/monster/12345'
    }

    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    this.setState({branchLink: url})
    console.log(url)
  }
  
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10, margin: 10}} onPress={this.createBranchLink}>
                <Text>Create url</Text>
              </TouchableOpacity>
            <Text>{this.state.branchLink}</Text>
            <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, padding: 10, margin: 10}} onPress={this.showShare}>
              <Text>Show Share Sheet</Text>
            </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
