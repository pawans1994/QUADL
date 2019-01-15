#!/usr/bin/perl
use strict;
use warnings;

#program for makeing a input file for value iteration.
#state model is transition_bkt_vpcount
#output is


#state count
#perl transition_bkt_statecount.#!/usr/bin/env perl
#^ edge count

#print origin dest action prob
#get correct / incorrect information

#marge correct . incorrect data
#{origin + action} : count
#vpcount

################################probalibity###
#count go out edge
#classify_treatment_medications_SKILL
#analyze_intelligence_concepts_SKILL
# my $kc = $ARGV[0];

#input file
#RafineCourse2_simulation_3_stud10000_statejoin.csv
#/page_actVector_prob_transition/RafineCourse2_simulation_3_${verstion}_stateTransition.csv


# my $version = $ARGV[0];
# count_prob($version);
count_prob();





sub count_edge{
  # my $verstion = $_[0];
  open(FILE,"< ../page_actVector_prob_transition/RafineCourse2_simulation_3_stud10000_statjoin_round.csv") or die ("can't open the file:$!");
  my %edgecount;
  my %destcount;
  my $rowcount=0;
  while(my $line=<FILE>){
    if($rowcount != 0){
      chomp($line);
      my @data = split(/,/,$line);
      my $action = $data[4];
      my $origin = $data[7];
      my $dest =$data[8];
      my $origin_action = $origin."¥".$action;
      my $origin_action_dest = $origin."¥".$action."¥".$dest;
      # print "@data\n";
      # print "action:$action,origin:$origin,dest:$dest,originaction:$origin_action,oririnactiondest:$origin_action_dest\n";
      $edgecount{$origin_action}++;
      $destcount{$origin_action_dest}++;
    }
    $rowcount++;

  }
  close(FILE);


  return \%edgecount,\%destcount;
}

sub count_prob{
  # my $version = $_[0];
  my ($re_edgecount,$re_destcount) = count_edge();
  my %edgecount = %$re_edgecount;
  my %destcount = %$re_destcount;
  #print edgecount and desrcount
  # print "edgecount\n";
  # while(my($key,$value) = each(%edgecount)){
  #   print "$key,$value\n";
  # }
  # print "destcount\n";
  # while(my($key,$value) = each(%destcount)){
  #   print "$key,$value\n";
  # }
  my %problist;
  print "kc,origin,action,dest,probability,reward\n";
  while(my($key,$value) = each(%destcount)){
    # print "dest,$key,count,$value\n";
    my @data = split(/\¥/,$key);
    my $origin = $data[0];
    my $action = $data[1];
    my $dest = $data[2];
    my $origin_action = $origin."¥".$action;
    my @origin_split = split(/_/,$origin);
    my $origin_page = int $origin_split[0];
    my $origin_prob = $origin_split[2]+0;#cast as a double
    my @dest_split = split(/_/,$dest);
    my $dest_page = int $dest_split[0];
    # print "$dest_lvalue\n";
    my $dest_actionVct = int $dest_split[1];
    my $dest_prob = $dest_split[2]+0;#cast as a double
    my $reward=0;


    # if($dest_vcount > 20 or $dest_pcount > 20){
    #   $reward = -1.0;
    #   # $reward = -2.0;
    # }
    if($dest_prob == 8.5){
      $reward = 1.0;
    }
    if($action=~ /^Quiz/ or $action=~ /^Video/){
      $reward += -0.04;
      # $reward = -0.1;
    }
    if($origin_prob < $dest_prob){
      $reward += -0.01;
      # $reward += 0.01;
    }
    if($origin_prob > $dest_prob){
      $reward += -0.1;
      #$reward = -0.5;
    }
    if($origin_prob == $dest_prob){
      # $reward = 0.05;
      $reward += -0.1;
    }
    # else{
    #   $reward = "else";
    # }


    my $outgoingcount = $edgecount{$origin_action};
    # print "$origin_action, $origin_lvalue, $dest_lvalue\n";
    # print "edge::$origin_action,  count:  $edgecount{$origin_action} reward: $reward\n";


    $problist{$key} =$value/$outgoingcount;
    print "kc1,$origin,$action,$dest,$problist{$key},$reward\n";
  }
}






#state_actinonpaor_dest
#state_actionpair_dest / state_actionpair = prob

#reward
#asmt = correct or incorrect
#if($asmt = correct)
# reward = 0.1
# #if'$asmt = incorrect
# reward = -0.1
# #terminal
# reward = 1.0
# #count > 10 NOR tehrminal
# rew
#
